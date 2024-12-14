const workspaceService = require("../services/workspaceService");

exports.createWorkspace = async (request, response) => {
    try {
        const result = await workspaceService.createWorkspace(request.body);
        response.status(200).json(result);
    } catch (error) {
        response.status(500).json(
            getInternalError(error)
        );
    }
};

exports.getWorkspaces = async (request, response) => {
    try {
        const result = await workspaceService.getWorkspaces();
        response.status(200).json(result);
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