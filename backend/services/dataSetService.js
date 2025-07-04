const DataLayerModel = require("../db/models/dataLayer");
const DataSetModel = require("../db/models/dataSet");

async function getDataSets(filter) {
    try {
        let result = [];
        const query = {};
        
        if(filter) {
            if(filter.name) {
                query.name = { $regex: filter.name, $options: 'i' };
            }
            if(filter.layerId) {
                query.layers = filter.layerId;
            }
        }

        let dataSets = await DataSetModel.find(query);
        if(dataSets?.length > 0) {
            for (const dataSet of dataSets) {
                result.push({
                    id: dataSet._id,
                    name: dataSet.name,
                    description: dataSet.description,
                    layers: dataSet.layers
                });
            }
        }

        return result;
    } catch (error) {
        throw error;
    }
}

async function getDataSet(id) {
    try {
        let dataSet = await DataSetModel.findById(id);

        return dataSet;
    } catch (error) {
        throw error;
    }
}

async function addDataLayer(dataSetId, dataLayerId) {
    try {
        let dataSet = await DataSetModel.findById(dataSetId);
        if(!dataSet) {
            throw `Error adding dataLayer (${dataLayerId}) to dataSet (${dataSetId}): DataSet doesn't exist!`
        }
        let dataLayer = await DataLayerModel.findById(dataLayerId);
        if(!dataLayer) {
            throw `Error adding dataLayer (${dataLayerId}) to dataSet (${dataSetId}): DataLayer doesn't exist!`
        }
        dataSet.layers.push(dataLayerId);
        await dataSet.save();
    } catch (error) {
        console.log('Error adding dataLayer to dataSet');
        console.log(error);
        throw error;
    }
}

async function removeDataLayer(dataSetId, dataLayerId) {
    try {
        let dataSet = await DataSetModel.findById(dataSetId);
        if(!dataSet) {
            throw `Error removing dataLayer (${dataLayerId}) from dataSet (${dataSetId}): DataSet doesn't exist!`
        }
        let dataLayer = await DataLayerModel.findById(dataLayerId);
        if(!dataLayer) {
            throw `Error removing dataLayer (${dataLayerId}) from dataSet (${dataSetId}): DataLayer doesn't exist!`
        }
        
        let indexOfDataLayerInDataSet = dataSet.layers.findIndex(layerItemId => layerItemId == dataLayerId);
        if(indexOfDataLayerInDataSet > -1) {
            dataSet.layers.splice(indexOfDataLayerInDataSet, 1);
        }

        return await dataSet.save();
    } catch (error) {
        console.log('Error removing dataLayer from dataSet');
        console.log(error);
        throw error;
    }
}

async function createDataSet(name, description) {
    try {
        let newDataSet = new DataSetModel({ name: name, description: description });
        let result = await newDataSet.save();
 
        return {
            id: result._id,
            name: result.name,
            description: result.description,
            layers: result.layers
        };
    } catch (error) {
        console.log('Error creating dataSet');
        console.log(error);
        throw error;
    }
}

async function deleteDataSetById(id) {
    try {
        await DataSetModel.findByIdAndDelete(id);
    } catch (error) {
        console.log('Error deleting dataSet');
        console.log(error);
        throw error;
    }
}

async function deleteDataSetByName(name) {
    try {
        await DataSetModel.deleteOne({ name: name});
    } catch (error) {
        console.log('Error deleting dataSet');
        console.log(error);
        throw error;
    }
}

module.exports = {
    getDataSets,
    getDataSet,
    addDataLayer,
    removeDataLayer,
    createDataSet,
    deleteDataSetByName,
    deleteDataSetById
}