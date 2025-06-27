const axios = require('axios');
const fs = require("fs");
const Readable = require("stream").Readable;
const { NodeSSH } = require("node-ssh");
const geoserverConfig = require('../../config/geoserverConfig');

async function createCoverageStore(storeDetails) {
    try {
        const url = `${geoserverConfig.url}/rest/workspaces/${storeDetails.workspaceName}/coveragestores`;

        // I. Upload file to GeoServer filesystem
        const baseFilePath = `./uploads`;
        let localFilePath = `${baseFilePath}/${storeDetails.file.name}`;

        // I. 1. Create uploads directory
        if(!fs.existsSync(baseFilePath)) {
            fs.mkdirSync(baseFilePath);
        }
        // I.2. Save file to uploads directory
        console.log(`Saving file ('${localFilePath}') locally...`);
        const fileBuffer = Buffer.from(storeDetails.file.data, 'base64')
        var readable = new Readable();
        readable.push(fileBuffer);
        readable.push(null);
        readable.pipe(fs.createWriteStream(localFilePath));
        // I.3. Upload file to GeoServer
        let remoteFilePath = `${geoserverConfig.vmBaseRemotePath}/${storeDetails.file.name}`;
        console.log(`Uploading file to GeoServer filesystem ('${remoteFilePath}')...`)
        await uploadFileToHost(geoserverConfig.ssh, localFilePath, remoteFilePath);
        // I.4. Create store using the uploaded file
        const payload = {
            coverageStore: {
                name: storeDetails.store.name,
                workspace: storeDetails.workspaceName,
                type: 'GeoTIFF',
                url: `file:${geoserverConfig.baseRemotePath}/${storeDetails.file.name}`,
                enabled: true
            },
        };

        const response = await axios.post(url, payload, getGeoserverConfig());
        return response.data;
    } catch (error) {
        console.error('Error creating coverage store:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
};

async function createDataStore(params) {
    try {
        // TODO:
    } catch (error) {
        console.error('Error creating data store:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

async function getStores(workspaceName) {
    try {
        const urlCoverageStores = `${geoserverConfig.url}/rest/workspaces/${workspaceName}/coveragestores`;
        const urlDataStores = `${geoserverConfig.url}/rest/workspaces/${workspaceName}/datastores`;

        const responseCoverageStores = await axios.get(urlCoverageStores, getGeoserverConfig());
        const responseDataStores = await axios.get(urlDataStores, getGeoserverConfig());
        
        return {
            coverageStores: responseCoverageStores.data.coverageStores,
            dataStores: responseDataStores.data.dataStores
        }
    } catch (error) {
        console.error('Error getting stores:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

async function getStore(workspaceName, storeName, storeType) {
    try {
        switch (storeType) {
            case "coverage":
                const url = `${geoserverConfig.url}/rest/workspaces/${workspaceName}/coveragestores/${storeName}`;
                const response = await axios.get(url, getGeoserverConfig());
                return response.data;
            default:
                throw "Unknown store type!";
        }

    } catch (error) {
        if(error.status >= 400 && error.status < 500) {
            return null;
        }

        console.error('Error getting store:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

async function deleteStore(workspaceName, storeName, storeType) {
    let url = null;

    try {
        switch (storeType) {
            case "coverage":
                url = `${geoserverConfig.url}/rest/workspaces/${workspaceName}/coveragestores/${storeName}?recurse=true`;
                break;
            case "datastore":
                url = `${geoserverConfig.url}/rest/workspaces/${workspaceName}/datastores/${storeName}?recurse=true`;
                break;
            default:
                throw "Unknown store type!";
        }

        console.log(url);
        let response = await axios.delete(url, getGeoserverConfig());
    } catch (error) {
        console.error('Error deleting store:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

function getGeoserverConfig() {
    return {
        auth: geoserverConfig.auth,
        headers: { 'Content-Type': 'application/json' }
    };
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
    createCoverageStore,
    createDataStore,
    getStore,
    getStores,
    deleteStore
}