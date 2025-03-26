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
                        title: layerDetails.layer.name, // Optional
                        // nativeCRS: 'EPSG:4326', // Optional. Replace with the correct CRS of your shapefile
                        // srs: 'EPSG:4326', // Optional. Replace with the correct CRS of your shapefile
                        enabled: true
                    }
                };
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

function getGeoserverConfig() {
    return {
        auth: geoserverConfig.auth,
        headers: { 'Content-Type': 'application/json' }
    };
}

module.exports = {
    createLayer,
    getLayers
}