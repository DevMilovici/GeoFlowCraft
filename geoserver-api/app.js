const express = require('express');
const workspaceRoutes = require("./routes/workspaceRoutes");
const storeRoutes = require("./routes/storeRoutes");
const layerRoutes = require("./routes/layerRoutes");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '10000mb', extended: true }));

app.use('/api', workspaceRoutes);
app.use('/api', storeRoutes);
app.use('/api', layerRoutes)

// TODOs
// app.use('/api/layers', layerRoutes);

app.use((error, request, response, next) => {
    response.status(500).json({
        success: false,
        message: error.message
    });
});

module.exports = app;