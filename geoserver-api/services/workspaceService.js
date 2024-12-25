const axios = require('axios');
const geoserverConfig = require('../config/geoserverConfig');

async function createWorkspace(workspaceDetails) {
    try {
        const url = `${geoserverConfig.url}/rest/workspaces`;

        const payload = {
            workspace: {
                name: workspaceDetails.name
            }
        };

        const response = await axios.post(url, payload, getGeoserverConfig());
        console.log(`Workspace created successfully:`, response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating workspace:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
};

async function getWorkspaces() {
    try {
        const url = `${geoserverConfig.url}/rest/workspaces`;

        const response = await axios.get(url, getGeoserverConfig());
        return response.data;
    } catch (error) {
        console.error('Error getting workspace:', error.response?.data || error.message);
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
    createWorkspace,
    getWorkspaces
}