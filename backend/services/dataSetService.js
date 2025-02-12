const DataSetModel = require("../db/models/dataSet");

async function getDataSets() {
    try {
        let dataSets = await DataSetModel.find();

        return dataSets;
    } catch (error) {
        throw error;
    }
}

async function createDataSet(name, description) {
    try {
        let newDataSet = new DataSetModel({ name: name, description: description });
        let result = await newDataSet.save();
 
        return result;
    } catch (error) {
        console.log('Error creating dataSet');
        console.log(error);
        throw error;
    }
}

async function deleteDataSet(name) {
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
    createDataSet,
    deleteDataSet
}