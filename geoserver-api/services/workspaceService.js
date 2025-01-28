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
        console.error('Error getting workspaces:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

async function getWorkspace(workspaceName) {
    try {
        const url = `${geoserverConfig.url}/rest/workspaces/${workspaceName}`;
        const response = await axios.get(url, getGeoserverConfig());
        return response.data;
    } catch (error) {
        if(error.status >= 400 && error.status < 500) {
            return null;
        }
        console.error('Error getting workspace:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

async function updateWorkspace(workspaceToUpdateDetails) {
    try {
        const url = `${geoserverConfig.url}/rest/workspaces/${workspaceToUpdateDetails.name}`;

        const payload = {
            workspace: {
                name: workspaceToUpdateDetails.newName
            }
        };
        const response = await axios.put(url, payload, getGeoserverConfig());

        return response.data;
    } catch (error) {
        console.error('Error updating workspace:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message);
    }
}

async function deleteWorkspace(workspaceToDeleteDetails) {
    try {
        let url = `${geoserverConfig.url}/rest/workspaces/${workspaceToDeleteDetails.name}`;
        if(workspaceToDeleteDetails.recurse) {
            url += `?recurse=${workspaceToDeleteDetails.recurse}`;
        }

        const response = await axios.delete(url, getGeoserverConfig());
        
        return response.data;
    } catch (error) {
        console.error('Error deleting workspace:', error.response?.data || error.message);
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
    getWorkspaces,
    getWorkspace,
    updateWorkspace,
    deleteWorkspace
}