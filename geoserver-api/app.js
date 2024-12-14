const express = require('express');
const workspaceRoutes = require("./routes/workspaceRoutes");

const app = express();

app.use(express.json());

app.use('/api', workspaceRoutes);

// TODOs
// app.use('/api/stores', storeRoutes);
// app.use('/api/layers', layerRoutes);

app.use((error, request, response, next) => {
    response.status(500).json({
        success: false,
        message: error.message
    });
});

module.exports = app;