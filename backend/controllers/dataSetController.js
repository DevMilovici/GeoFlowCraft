const dataSetService = require("../services/dataSetService");

async function getDataSets(request, response) {
    try {
        const result = await dataSetService.getDataSets();
        response.status(200).json({ success: true, dataSets: result });
    } catch (error) {
        response.status(200).json(getInternalError(error));
    }
}

async function createDataSet(request, response) {
    try {
        let dataSetName = request.body.name;
        let dataSetDescription = request.body.description;

        const result = await dataSetService.createDataSet(dataSetName, dataSetDescription);

        response.status(200).json({ sucess: true, dataSet: result });
    } catch (error) {
        response.status(200).json(getInternalError(error));
    }
}

async function updateDataSet(request, response) {
    try {
        throw new Error("not implemented");
    } catch (error) {
        response.status(200).json(getInternalError(error));
    }
}

async function deleteDataSet(request, response) {
    try {
        let dataSetName = request.body.name;

        await dataSetService.deleteDataSet(dataSetName);
        response.status(200).json({ success: true });
    } catch (error) {
        response.status(200).json(getInternalError(error));
    }
}

function getInternalError(error) {
    return { 
        success: false, 
        message: error.message ?? `Something went wrong` 
    };
}

module.exports = {
    getDataSets,
    createDataSet,
    updateDataSet,
    deleteDataSet
}