const axios = require("axios");
const geoserverConfig = require('../config/geoserverConfig');

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
        // TODO: CoverageStore OR DataStore
        const storeType = layerDetails.store.type;
        switch (storeType) {
            case "coverage":
                const url = `${geoserverConfig.url}/rest/workspaces/${layerDetails.workspaceName}/coveragestores/${layerDetails.store.name}/coverages`;
        
                const payload = {
                    coverage: {
                        name: layerDetails.layer.name,
                        title: layerDetails.layer.name, // optional
                        type: 'RASTER',
                        enabled: true
                    }
                };
        
                const response = await axios.post(url, payload, getGeoserverConfig());
                
                return response.data;
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