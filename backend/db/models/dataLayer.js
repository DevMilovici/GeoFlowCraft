const mongoose = require("mongoose");

const dataLayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 2,
        max: 100
    },
    description: {
        type: String,
        max: 1000,
    },
    geoserver: {
        type: new mongoose.Schema({
            url: {
                type: String,
                required: true,
            },
            workspace: {
                name: {
                    type: String,
                    required: true
                }
            },
            store: {
                name: {
                    type: String,
                    required: true
                },
                type: {
                    type: String,
                    required: true
                }
            },
            layer: {
                name: {
                    type: String,
                    required: true
                },
                format: {
                    name: {
                        type: String,
                        required: true
                    }
                },
                source: {
                    type: String,
                    required: true
                },
                params: {
                    type: Map,
                    of: String
                },
            },
            files: [
                new mongoose.Schema({
                    path: {
                        type: String,
                        required: true
                    }},
                    { _id: false }
                )
            ]},
            { _id: false }
        ),
        required: false
    }
});

module.exports = mongoose.model("DataLayer", dataLayerSchema);