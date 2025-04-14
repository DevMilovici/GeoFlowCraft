const controllerUtils = require("../utils/controllerUtils");
const dataLayerService = require("../services/dataLayerService");
const dataSetService = require("../services/dataSetService");
const workspaceService = require("../services/geoserver/workspaceService");
const layerService = require("../services/geoserver/layerService");
const serverConfig = require("../config/serverConfig");
const geoserverConfig = require("../config/geoserverConfig");
const postgresConfig = require("../config/postgresConfig");

const fs = require("fs");
const Readable = require("stream").Readable;
const { NodeSSH } = require("node-ssh");
const axios = require('axios');
const extractZIP = require('extract-zip');
const path = require('path');
const { Client } = require('pg');
const csv = require('csv-parser');

async function getDataLayers(request, response) {
    try {
        const result = await dataLayerService.getDataLayers();
        response.status(200).json({ success: true, dataLayers: result });
    } catch (error) {
        response.status(200).json(controllerUtils.getInternalError(error));
    }
}

async function getDataLayer(request, response) {
    try {
        const dataLayerId = request.params.id;
        const result = await dataLayerService.getDataLayer(dataLayerId);

        response.status(200).json({ success: true, dataLayer: result });
    } catch (error) {
        response.status(200).json(controllerUtils.getInternalError(error));
    }
}

async function createDataLayer(request, response) {
    let newDataLayerId = null;
    try {
        let dataLayerName = request.body.name;
        let dataLayerDescription = request.body.description;
        
        console.log(`Saving partial DataLayer ('${dataLayerName}') to database...`);
        newDataLayerId = await dataLayerService.createDataLayer({
            name: dataLayerName,
            description: dataLayerDescription
        });
        if(!newDataLayerId) {
            throw "Something went wrong. Couldn't save new data layer to database.";
        }
        
        let layerContent = request.body.content;
        if(!layerContent || layerContent.length < 1) {
            throw "DataLayer's 'content' should have at least one item";
        }
        
        // for (const layerContentItem of layerContent) {
        let layerContentItem = layerContent[0];
        // 1. Create base upload path if it doesn't exist
        if(!fs.existsSync(serverConfig.baseUploadPath)) {
            fs.mkdirSync(serverConfig.baseUploadPath);
        }
        // 2. Extract file extension and content
        let fileExtension = null;
        let fileContentBuffer = null;
        switch (layerContentItem.format?.toLowerCase()) {
            case "tiff/base64":
                fileExtension = "tiff";
                break;
            case "x-zip-compressed/base64":
                fileExtension = "zip";
                break;
                case "csv/base64":
                fileExtension = "csv";
                break;
            default:
                throw `Unknown file content format: '${layerContentItem.format.toLowerCase()}'`
        }
        
        // 3. Save file locally
        fileContentBuffer = Buffer.from(layerContentItem.data, "base64");
        const filenameWithoutExtension = `${newDataLayerId}`;
        let filename = `${newDataLayerId}.${fileExtension}`;
        const localFilePath = `${serverConfig.baseUploadPath}/${filename}`;
        console.log(`Saving file '${localFilePath}' locally...`);
        var readable = new Readable();
        readable.push(fileContentBuffer);
        readable.push(null);
        readable.pipe(fs.createWriteStream(localFilePath));
        
        // 4. Upload to GeoServer / Postgres (PostGIS)
        let geoServerPath = null;
        let layerName = `layer_${newDataLayerId}`;
        switch (fileExtension) {
            case "tiff":
                // Upload file
                geoServerPath = `${geoserverConfig.vmBaseRemotePath}/${filename}`;
                console.log(`Uploading file ('${geoServerPath}') to GeoServer's filesystem...`);
                await uploadFileToHost(geoserverConfig.ssh, localFilePath, geoServerPath);
                break;
            case "zip":
                // Unzip to directory
                const unzipPath = `${serverConfig.baseUploadPath}/${filenameWithoutExtension}`;
                // PS: 'extract-zip' requires absolute path
                console.log(`Unziping file ('${localFilePath}') locally to ('${path.resolve(unzipPath)}')...`);
                await extractZIP(localFilePath, { dir: path.resolve(unzipPath) });

                // Rename all the files in the directory
                console.log(`Rename files in the directory '${unzipPath}' to have base name as '${filenameWithoutExtension}'`);
                renameAllFilesInDirectory(unzipPath, `layer_${filenameWithoutExtension}`);

                // Detecting if we have a shapefile
                console.log(`Searching for .shp file...`);
                filename = findFirstShpFile(unzipPath);
                if(filename) {
                    console.log(`.shp file detected: '${filename}'`);
                }

                const geoserverDirectoryPath = `${geoserverConfig.vmBaseRemotePath}/${filenameWithoutExtension}`;
                geoServerPath = geoserverDirectoryPath;
                console.log(`Uploading directory ('${geoserverDirectoryPath}') to GeoServer's filesystem...`);
                // Upload directory
                await uploadDirectoryToHost(geoserverConfig.ssh, unzipPath, geoserverDirectoryPath);
                break;
            case "csv":
                // Upload file
                geoServerPath = `${geoserverConfig.vmBaseRemotePath}/${filename}`;
                console.log(`Uploading file ('${geoServerPath}') to GeoServer's filesystem...`);
                await uploadFileToHost(geoserverConfig.ssh, localFilePath, geoServerPath);
                // Publish to postgres (postgis) DB
                console.log(`Importing .csv to '${layerName}' postgres table...`);
                await importCSVToPostGIS(
                    localFilePath, 
                    layerName,
                    layerContentItem.srs,
                    layerContentItem.latColumn, layerContentItem.lonColumn, 
                    layerContentItem.otherColumns
                );
                break;
            default:
                throw `Unknown file extension: '${fileExtension}'`;
        }

        // 5. Create workspace
        const workspaceName = request.body.geoserver?.workspace ?? geoserverConfig.defaultWorkspace;
        let workspace = await workspaceService.getWorkspace(workspaceName);
        if(!workspace) {
            console.log(`Creating GeoServer workspace '${workspaceName}'...`);
            await workspaceService.createWorkspace({
                name: workspaceName
            });
        }

        // 6. Create store
        const storeName = request.body.geoserver?.store?.name ?? `store_${newDataLayerId}`;
        let storeType = request.body.geoserver?.store?.type;
        let storeCreateUrl = null;
        if(!storeType) {
            switch (fileExtension) {
                case "tiff":
                    storeType = "GeoTIFF"
                    break;
                case "zip":
                    storeType = "Shapefile";
                    break;
                case "csv":
                    storeType = "PostGIS";
                    break;
                default:
                    throw `Unknown file extension: '${fileExtension}'`;
            }
        }

        let payload = null;
        switch (storeType) {
            case "GeoTIFF":
                storeCreateUrl = `${geoserverConfig.url}/rest/workspaces/${workspaceName}/coveragestores`;
                payload = {
                    coverageStore: {
                        name: storeName,
                        workspace: workspaceName,
                        type: storeType,
                        url: `file:${geoserverConfig.baseRemotePath}/${filename}`,
                        enabled: true
                    },
                };
                break;
            case "Shapefile":
                storeCreateUrl = `${geoserverConfig.url}/rest/workspaces/${workspaceName}/datastores`;
                payload = {
                    dataStore: {
                        name: storeName,
                        connectionParameters: {
                            entry: [
                                { '@key': 'url', $: `file:${geoserverConfig.baseRemotePath}/${filenameWithoutExtension}/${filename}` },
                            ],
                        },
                        type: 'Shapefile',
                        enabled: true
                    }
                }
                break;
            case "PostGIS":
                storeCreateUrl = `${geoserverConfig.url}/rest/workspaces/${workspaceName}/datastores`;
                payload = {
                    dataStore: {
                        name: storeName,
                        type: 'PostGIS',
                        enabled: true,
                        connectionParameters: {
                            entry: [
                                { "@key": "host", "$": postgresConfig.host },
                                { "@key": "port", "$": postgresConfig.port.toString() },
                                { "@key": "database", "$": postgresConfig.database },
                                { "@key": "user", "$": postgresConfig.user },
                                { "@key": "passwd", "$": postgresConfig.password },
                                { "@key": "schema", "$": "public" },
                                { "@key": "Expose primary keys", "$": "true" },
                                { "@key": "Estimated extends", "$": "true" },
                                { "@key": "validate connections", "$": "true" },
                                { "@key": "Loose bbox", "$": "true" },
                                { "@key": "preparedStatements", "$": "false" }
                            ]
                        }
                    }
                };

                break;
            default:
                throw `Unknown store type: '${storeType}'`;
        }

        console.log(`Creating GeoServer store '${storeName}'...`);
        await axios.post(
            storeCreateUrl, 
            payload, 
            {
                auth: geoserverConfig.auth,
                headers: { 'Content-Type': 'application/json' }
            }
        );

        // 7. Create layer
        let layerFormat = null;
        let layerSource = null;
        console.log(`Creating layer '${layerName}'...`)
        switch (storeType) {
            case "GeoTIFF":
                layerFormat = "image/png"
                layerSource = "wms";
                await layerService.createLayer({
                    workspaceName: workspaceName,
                    store: {
                        name: storeName,
                        type: "coverage"
                    },
                    layer: {
                        name: layerName
                    }
                });
                break;
            case "Shapefile":
                layerFormat = "image/png"
                layerSource = "wms";
                await layerService.createLayer({
                    workspaceName: workspaceName,
                    store: {
                        name: storeName,
                        type: "datastore"
                    },
                    layer: {
                        name: layerName
                    }
                })
                break;
            case "PostGIS":
                layerFormat = "image/png";
                layerSource = "wms";
                let layerAttributes = [
                    {
                        name: "geom",
                        binding: "org.locationtech.jts.geom.Point",
                        nillable: false
                    },
                    {
                        name: layerContentItem.latColumn || 'lat',
                        binding: "java.lang.Double",
                        nillable: true
                    },
                    {
                        name: layerContentItem.lonColumn || 'lon',
                        binding: "java.lang.Double",
                        nillable: true
                    }
                ];
                if(layerContentItem.otherColumns?.length > 0) {
                    for (const otherColumn of layerContentItem.otherColumns) {
                        try {                            
                            let binding = null;
                            switch (otherColumn.type) {
                                case "FLOAT":
                                    binding = "java.lang.Double";
                                    break;
                                default:
                                    throw `Unknown attribute type '${otherColumn.type}'`;
                            }
                            layerAttributes.push({
                                name: otherColumn.key,
                                binding: binding,
                                nillable: true
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
                await layerService.createLayer({
                    workspaceName,
                    store: {
                        name: storeName,
                        type: "datastore"
                    },
                    layer: {
                        name: layerName,
                        title: layerName
                    },
                    nativeCRS: layerContentItem.srs || 'EPSG:4326',
                    srs: layerContentItem.srs || 'EPSG:4326',
                    attributes: {
                        attribute: layerAttributes
                    }
                });
                break;
            default:
                throw `Unknown store type: '${storeType}'`;
        }

        // 8. Update DataLayer from the database
        console.log(`Updating database DataLayer ('${dataLayerName}') with missing information...`);
        await dataLayerService.updateDataLayer({
            id: newDataLayerId,
            name: dataLayerName,
            description: dataLayerDescription,
            geoserver: {
                url: geoserverConfig.url,
                workspace: {
                    name: workspaceName
                },
                store: {
                    name: storeName,
                    type: storeType
                },
                layer: {
                    name: layerName,
                    format: {
                        name: layerFormat
                    },
                    source: layerSource,
                    params: null // TODO
                },
                files: [
                    {
                        path: geoServerPath
                    }
                ]}
            }
        );

        let newCreatedDataLayer = await dataLayerService.getDataLayer(newDataLayerId);

        // 9. Add dataLayer to dataSet
        let dataSetId = request.body.dataSetId;
        if(dataSetId) {
            console.log(`Adding DataLayer ('${newDataLayerId}') to DataSet ('${dataSetId}')...`);
            await dataSetService.addDataLayer(dataSetId, newDataLayerId)
        }
        // fileIndex++;
        // }
    
        response.status(200).json({ success: true, dataLayer: newCreatedDataLayer });
    } catch (error) {
        console.log(error);
        response.status(200).json(controllerUtils.getInternalError(error));
        try {
            if(newDataLayerId) {
                console.log("Deleting the partial layer...");
                await dataLayerService.deleteDataLayer({ id: newDataLayerId });
            }
        } catch (error) {
            console.log(error);    
        }
    }
}

async function importCSVToPostGIS(csvFilePath, tableName, srs, latColumn, lonColumn, otherColumns) {
    const client = new Client(postgresConfig);
    await client.connect();

    try {
        let queryCreateTable = `CREATE TABLE ${tableName}`;
        queryCreateTable += `(id SERIAL PRIMARY KEY, geom GEOMETRY(POINT, ${srs.split(":")[1] || '4326'})`
        queryCreateTable += `, ${latColumn || 'lat'} FLOAT`
        queryCreateTable += `, ${lonColumn || 'lon'} FLOAT`;

        if(otherColumns?.length > 0) {
            for (const otherColumn of otherColumns) {
                switch(otherColumn.type) {
                    case 'FLOAT':
                        queryCreateTable += `, ${otherColumn.key} FLOAT`
                        break;
                    default:
                        throw `Column type '${otherColumn.type}' not implemented`;
                }
            }
        }

        queryCreateTable += `);`;

        // Create table
        await client.query(queryCreateTable);

        // Read CSV and insert data
        const stream = fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', async (row) => {
                const lat = row[`${latColumn}`];
                const lon = row[`${lonColumn}`];

                if (!lat || !lon) {
                    console.warn('Skipping row with missing coordinates:', row);
                    return;
                }
                let values = [lat, lon];

                let queryInsertColumns = `INSERT INTO ${tableName} (geom, lat, lon`;
                let queryInsertValues = `VALUES (ST_SetSRID(ST_MakePoint($1, $2), ${srs.split(":")[1] || '4326'}), $1, $2`;

                let columnIndex = 3;
                if(otherColumns?.length > 0) {
                    for(const otherColumn of otherColumns) {
                        queryInsertColumns += `, ${otherColumn.key}`
                        queryInsertValues += `, $${columnIndex++}`;
                        values.push(row[`${otherColumn.key}`]);
                    }
                }
                queryInsertColumns += `)`;
                queryInsertValues += `)`;
                queryInsert = `${queryInsertColumns} ${queryInsertValues}`;
                // console.log(queryInsert)
                // console.log(values);

                await client.query(queryInsert, values);
            });

        await new Promise((resolve) => stream.on('end', resolve));

        // Create spatial index
        await client.query(`
            CREATE INDEX idx_${tableName}_geom ON ${tableName} USING GIST(geom);
        `);

        return tableName;
    } finally {
        await client.end();
    }
}

// Helper function to upload file to a host using ssh
async function uploadFileToHost(hostConfig, localFilePath, remoteFilePath) {
    const sshClient = new NodeSSH();
    try {
        await sshClient.connect(hostConfig);
        console.log(`Connected to host server '${hostConfig.host}'.`);

        await sshClient.putFile(localFilePath, remoteFilePath);
        console.log(`File uploaded to host server '${hostConfig.host}':`, remoteFilePath);
    } catch (error) {
        console.error(`Error uploading file to host '${hostConfig.host}':`, error.message);
        throw error;
    } finally {
        sshClient.dispose();
    }
}

async function uploadDirectoryToHost(hostConfig, localDirPath, remoteDirPath) {
    const sshClient = new NodeSSH();
    try {
        await sshClient.connect(hostConfig);
        console.log(`Connected to host server '${hostConfig.host}'.`);

        await sshClient.putDirectory(localDirPath, remoteDirPath, {
            recursive: true,
            concurrency: 5, // Adjust concurrency based on performance needs
        });

        console.log(`Directory uploaded to host server '${hostConfig.host}':`, remoteDirPath);
    } catch (error) {
        console.error(`Error uploading directory to host '${hostConfig.host}':`, error.message);
        throw error;
    } finally {
        sshClient.dispose();
    }
}

function findFirstShpFile(directory) {
    try {
        const files = fs.readdirSync(directory);
        for (const file of files) {
            if (path.extname(file).toLowerCase() === '.shp') {
                return file;
            }
        }
        return null;
    } catch (err) {
        console.error('Error reading directory:', err);
        return null;
    }
}

/**
 * Renames a file
 * @param {string} oldPath - Current file path
 * @param {string} newName - New filename (with or without extension)
 * @param {boolean} [keepExtension=true] - Whether to preserve original extension
 * @returns {Promise<string>} New file path
 */
async function renameFile(oldPath, newName, keepExtension = true) {
    try {
        const dir = path.dirname(oldPath);
        let finalName = newName;
        
        if (keepExtension) {
            const ext = path.extname(oldPath);
            // Remove any extension the user might have provided
            finalName = path.basename(newName, path.extname(newName)) + ext;
        }
        
        const newPath = path.join(dir, finalName);
        await fs.rename(oldPath, newPath);
        return newPath;
    } catch (err) {
        console.error(`Error renaming ${oldPath} to ${newName}:`, err);
        throw err;
    }
}

/**
 * Synchronously renames all files in a directory to a new base name while keeping extensions
 * @param {string} directory - Path to the directory
 * @param {string} newBaseName - New base name for all files
 * @returns {Array} Array of objects containing {oldName, newName} for each renamed file
 */
function renameAllFilesInDirectory(directory, newBaseName) {
    const results = [];
    
    try {
        // Get all files in directory
        const files = fs.readdirSync(directory);
        
        // Counter for multiple files with same extension
        let counter = 1;
        const usedExtensions = new Set();
        
        files.forEach(file => {
            const oldPath = path.join(directory, file);
            
            // Skip directories
            if (fs.statSync(oldPath).isDirectory()) {
                return;
            }
            
            const ext = path.extname(file);
            let finalNewName = newBaseName;
            
            // Handle duplicate extensions by adding a number
            if (usedExtensions.has(ext)) {
                finalNewName = `${newBaseName}_${counter++}`;
            } else {
                usedExtensions.add(ext);
            }
            
            // Add original extension
            finalNewName += ext;
            
            const newPath = path.join(directory, finalNewName);
            
            try {
                fs.renameSync(oldPath, newPath);
                results.push({
                    oldName: file,
                    newName: finalNewName,
                    success: true
                });
            } catch (err) {
                results.push({
                    oldName: file,
                    newName: finalNewName,
                    success: false,
                    error: err.message
                });
            }
        });
        
        return results;
    } catch (err) {
        console.error(`Error processing directory ${directory}:`, err);
        throw err;
    }
}

module.exports = {
    getDataLayers,
    getDataLayer,
    createDataLayer
}