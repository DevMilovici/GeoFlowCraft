const workspaceService = require("../../services/geoserver/workspaceService");
const storeService = require("../../services/geoserver/storeService");
const layerService = require("../../services/geoserver/layerService");

async function createLayer(request, response) {
    try {
        // Check if workspace exists
        const workspaceName = request.body.workspaceName;
        if(!(await workspaceService.getWorkspace(workspaceName))) {
            return response.status(200).json({ success: false, message: `Workspace '${workspaceName}' doesn't exist!`});
        }

        // Check if store exists
        const storeName = request.body.store?.name;
        const storeType = request.body.store?.type;
        if(!(await storeService.getStore(workspaceName, storeName, storeType))) {
            return response.status(200).json({ success: false, message: `Store '${storeName}' doesn't exist!`});
        }

        const result = await layerService.createLayer(request.body);

        response.status(200).json({ success: true, layer: result });
    } catch (error) {
        console.log(error)
        response.status(500).json(
            getInternalError(error)
        );
    }
}

async function getLayers(request, response) {
    try {
        const result = await layerService.getLayers();
        response.status(200).json({ success: true, layers: result.layers });
    } catch (error) {
        response.status(500).json(
            getInternalError(error)
        );
    }
}

function getInternalError(error) {
    return { 
        success: false, 
        message: error.message ?? `Something went wrong` 
    };
}

module.exports = {
    createLayer,
    getLayers
}