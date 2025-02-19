const DataLayerModel = require("../db/models/dataLayer");

async function getDataLayers() {
    try {
        let dataLayers = await DataLayerModel.find();

        return dataLayers;
    } catch (error) {
        throw error;
    }
}

async function getDataLayer(id) {
    try {
        return await DataLayerModel.findById(id);
    } catch (error) {
        throw error;
    }
}

async function createDataLayer(dataLayerDetails) {
    try {
        let newDataLayer = new DataLayerModel(dataLayerDetails);
        let createdDataLayer = await newDataLayer.save();
        const newDataLayerId = createdDataLayer._id.toString();
        return newDataLayerId;
    } catch (error) {
        throw error;
    }
}

async function updateDataLayer(dataLayerDetails) {
    try {
        const dataLayer = await DataLayerModel.findById(dataLayerDetails.id);
        if(!dataLayer)
            return;

        dataLayer.name = dataLayerDetails.name;
        dataLayer.description = dataLayerDetails.description;
        dataLayer.geoserver = dataLayerDetails.geoserver;

        await dataLayer.save();
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getDataLayers,
    getDataLayer,
    createDataLayer,
    updateDataLayer
}