const controllerUtils = require("../utils/controllerUtils");
const dataLayerService = require("../services/dataLayerService");
const workspaceService = require("../services/geoserver/workspaceService");
const layerService = require("../services/geoserver/layerService");
const serverConfig = require("../config/serverConfig");
const geoserverConfig = require("../config/geoserverConfig");

const fs = require("fs");
const Readable = require("stream").Readable;
const { NodeSSH } = require("node-ssh");
const axios = require('axios');

async function getDataLayers(request, response) {
    try {
        const result = await dataLayerService.getDataLayers();
        response.status(200).json({ success: true, dataLayers: result });
    } catch (error) {
        response.status(200).json(controllerUtils.getInternalError(error));
    }
}

async function createDataLayer(request, response) {
    try {
        let dataLayerName = request.body.name;
        let dataLayerDescription = request.body.description;
        
        console.log(`Saving partial DataLayer ('${dataLayerName}') to database...`);
        const newDataLayerId = await dataLayerService.createDataLayer({
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
        
        let fileIndex = 0;
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
                fileContentBuffer = Buffer.from(layerContentItem.data, "base64");
                break;
            default:
                throw `Unknown file[${fileIndex}] content format: '${layerContentItem.format.toLowerCase()}'`
        }
        
        // 3. Save file locally
        const filename = `${newDataLayerId}_${fileIndex}.${fileExtension}`;
        const localFilePath = `${serverConfig.baseUploadPath}/${filename}`;
        console.log(`Saving file[${fileIndex}] ('${localFilePath}') locally...`);
        var readable = new Readable();
        readable.push(fileContentBuffer);
        readable.push(null);
        readable.pipe(fs.createWriteStream(localFilePath));
        
        // 4. Upload file to GeoServer
        const geoserverFilePath = `${geoserverConfig.vmBaseRemotePath}/${filename}`;
        console.log(`Uploading file[${fileIndex}] ('${geoserverFilePath}') to GeoServer's filesystem...`)
        await uploadFileToHost(geoserverConfig.ssh, localFilePath, geoserverFilePath);

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
        const storeType = request.body.geoserver?.store?.type;
        let storeCreateUrl = null;
        if(!storeType) {
            switch (fileExtension) {
                case "tiff":
                    storeType = "GeoTIFF"
                    break;
                default:
                    throw `Unknown file extension[${fileIndex}]: '${fileExtension}'`;
            }
        }

        let payload = null;
        switch (storeType) {
            case "GeoTIFF":
                // TODO: What if 
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
        const layerName = request.body.geoserver?.layer?.name ?? `layer_${newDataLayerId}`;
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
                        path: geoserverFilePath
                    }
                ]}
            }
        );

        let newCreatedDataLayer = await dataLayerService.getDataLayer(newDataLayerId);
        // fileIndex++;
        // }
    
        response.status(200).json({ success: true, dataLayer: newCreatedDataLayer });
    } catch (error) {
        console.log(error);
        response.status(200).json(controllerUtils.getInternalError(error));
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

module.exports = {
    getDataLayers,
    createDataLayer
}