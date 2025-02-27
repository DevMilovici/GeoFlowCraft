const dataSetService = require("../services/dataSetService");
const dataLayerService = require("../services/dataLayerService");

async function getDataSets(request, response) {
    try {
        const result = await dataSetService.getDataSets();
        response.status(200).json({ success: true, dataSets: result });
    } catch (error) {
        response.status(200).json(getInternalError(error));
    }
}

async function getDataSet(request, response) {
    try {
        let result = {};
        const dataSetId = request.params.id;
        const dataSet = await dataSetService.getDataSet(dataSetId);
        result.name = dataSet.name;
        result.id = dataSet._id;
        result.layers = [];

        if(dataSet && dataSet.layers && dataSet.layers?.length > 0) {
            for (const layerId of dataSet.layers) {
                const dataLayer = await dataLayerService.getDataLayer(layerId);
                result.layers.push({ 
                    id: dataLayer.id, 
                    name: dataLayer.name, 
                    description: dataLayer.description 
                });
            }
        }
        response.status(200).json({ success: true, dataSet: result });
    } catch (error) {
        response.status(200).json(getInternalError(error));
    }
}

async function createDataSet(request, response) {
    try {
        let dataSetName = request.body.name;
        let dataSetDescription = request.body.description;

        const result = await dataSetService.createDataSet(dataSetName, dataSetDescription);

        response.status(200).json({ success: true, dataSet: result });
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
    getDataSet,
    createDataSet,
    updateDataSet,
    deleteDataSet
}