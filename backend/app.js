const express = require('express');
const workspaceRoutes = require("./routes/geoserver/workspaceRoutes");
const storeRoutes = require("./routes/geoserver/storeRoutes");
const layerRoutes = require("./routes/geoserver/layerRoutes");
const dataSetRoutes = require("./routes/dataSetRoutes");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '10000mb', extended: true }));

app.use('/api/geoserver', workspaceRoutes);
app.use('/api/geoserver', storeRoutes);
app.use('/api/geoserver', layerRoutes)

app.use("/api/dataset", dataSetRoutes);

app.use((error, request, response, next) => {
    response.status(500).json({
        success: false,
        message: error.message
    });
});

module.exports = app;