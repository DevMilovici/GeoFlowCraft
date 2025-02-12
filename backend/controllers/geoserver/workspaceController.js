const workspaceService = require("../../services/geoserver/workspaceService");

exports.createWorkspace = async (request, response) => {
    try {
        const result = await workspaceService.createWorkspace(request.body);
        response.status(200).json({ success: true, workspace: result });
    } catch (error) {
        response.status(500).json(
            getInternalError(error)
        );
    }
};

exports.getWorkspace = async (request, response) => {
    try {
        const result = await workspaceService.getWorkspace(request.query.name);
        response.status(200).json({ success: true, workspace: result });
    } catch (error) {
        response.status(500).json(
            getInternalError(error)
        );
    }
}

exports.getWorkspaces = async (request, response) => {
    try {
        const result = await workspaceService.getWorkspaces();
        response.status(200).json({ success: true, workspaces: result.workspaces.workspace });
    } catch(error) {
        response.status(500).json(
            getInternalError(error)
        );
    }
}

exports.updateWorkspace = async (request, response) => {
    try {
        const result = await workspaceService.updateWorkspace(request.body);
        response.status(200).json({ success: true });
    } catch(error) {
        response.status(500).json(
            getInternalError(error)
        );
    }
}

exports.deleteWorkspace = async (request, response) => {
    try {
        const result = await workspaceService.deleteWorkspace({ name: request.params.name, recurse: request.query.recurse });
        response.status(200).json({ success: true });
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