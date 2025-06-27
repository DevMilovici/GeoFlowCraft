const axios = require("axios");
const geoserverConfig = require('../../config/geoserverConfig');

async function getLayers() {
    try {
        const url = `${geoserverConfig.url}/rest/layers`;

        const response = await axios.get(url, getGeoserverConfig());
        return response.data;
    } catch (error) {
        console.error('Error getting layers:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

async function createLayer(layerDetails) {
    try {
        let response = null;
        const storeType = layerDetails.store.type;
        let url = null;
        let payload = null;
        switch (storeType) {
            case "coverage":
                url = `${geoserverConfig.url}/rest/workspaces/${layerDetails.workspaceName}/coveragestores/${layerDetails.store.name}/coverages`;
        
                payload = {
                    coverage: {
                        name: layerDetails.layer.name,
                        title: layerDetails.layer.name, // optional
                        type: 'RASTER',
                        enabled: true
                    }
                };
        
                response = await axios.post(url, payload, getGeoserverConfig());
                
                return response.data;
            case "datastore":
                url = `${geoserverConfig.url}/rest/workspaces/${layerDetails.workspaceName}/datastores/${layerDetails.store.name}/featuretypes`;

                payload = {
                    featureType: {
                        name: layerDetails.layer.name,
                        enabled: true
                    }
                };
                if(layerDetails.layer.title) payload.featureType.title = layerDetails.layer.title;
                if(layerDetails.nativeName) payload.featureType.nativeName = layerDetails.nativeName;
                if(layerDetails.nativeCRS) payload.featureType.nativeCRS = layerDetails.nativeCRS;
                if(layerDetails.srs) payload.featureType.srs = layerDetails.srs;
                if(layerDetails.attributes) payload.featureType.attributes = layerDetails.attributes;

                response = await axios.post(url, payload, getGeoserverConfig());
                break;
            default:
                throw "Unknown store type!"
        }
    } catch (error) {
        console.error('Error creating layer:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

async function deleteLayer(layerDetails) {
    try {
        let url = `${geoserverConfig.url}/rest/workspaces/${layerDetails.workspaceName}/layers/${layerDetails.layerName}`;
        let response = await axios.delete(url, getGeoserverConfig());
    } catch (error) {
        console.error('Error deleting layer:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

function getGeoserverConfig() {
    return {
        auth: geoserverConfig.auth,
        headers: { 'Content-Type': 'application/json' }
    };
}

module.exports = {
    createLayer,
    deleteLayer,
    getLayers
}