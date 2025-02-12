const workspaceService = require("../services/workspaceService");
const storeService = require("../services/storeService");

async function createStore(request, response) {
    try {
        let workspaceName = request.body.workspaceName;
        
        // If the workspace doesn't exist, then create it
        if(!(await workspaceService.getWorkspace(workspaceName))) {
            await workspaceService.createWorkspace({ name: workspaceName});
        }

        // Create coverage store/data store
        let storeType = request.body.store?.type;
        
        let result = null;
        switch (storeType) {
            // A coverage store describes how access a raster data source.
            // - https://docs.geoserver.org/latest/en/api/#1.0.0/coveragestores.yaml
            case "coverage":
                result = await storeService.createCoverageStore({
                    workspaceName: workspaceName,
                    store: request.body.store,
                    file: request.body.file
                });
                break;
            // A data store contains vector format spatial data. 
            // - It can be a file (such as a shapefile), a database (such as PostGIS), or a server (such as a remote Web Feature Service).
            // - https://docs.geoserver.org/latest/en/api/#1.0.0/datastores.yaml
            case "data":
                console.log("TODO: data_store");
                //result = await storeService.createDataStore(workspaceName, storeName);
                break;
            default:
                return response.status(404).json(
                    { 
                        success: false, 
                        message: "Unknown store type! Use one of the following: 'coverage_store', 'data_store'"
                    }
                )
                break;
        }
        response.status(200).json({ success: true, store: result });
    } catch (error) {
        console.log(error)
        response.status(500).json(
            getInternalError(error)
        );
    }
};

async function getStores(request, response) {
    try {
        const result = await storeService.getStores(request.params.workspaceName);
        response.status(200).json({ success: true, stores: result });
    } catch(error) {
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
    createStore,
    getStores
}