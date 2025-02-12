const mongoose = require("mongoose");

const dataSetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 2,
        max: 100
    },
    description: {
        type: String,
        max: 1000
    },
    layers: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("DataSet", dataSetSchema);