const axios = require('axios');
const geoserverConfig = require('../config/geoserverConfig');

async function createWorkspace(workspaceDetails) {
    try {
        const url = `${geoserverConfig.url}/rest/workspaces`;
        const config = {
            auth: geoserverConfig.auth,
            headers: { 'Content-Type': 'application/json' }
        };

        const payload = {
            workspace: {
                name: workspaceDetails.name
            }
        };

        const response = await axios.post(url, payload, config);
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
        const config = {
            auth: geoserverConfig.auth,
            headers: { 'Content-Type': 'application/json' }
        };

        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        console.error('Error getting workspace:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

module.exports = {
    createWorkspace,
    getWorkspaces
}