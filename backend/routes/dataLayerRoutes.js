const express = require("express");
const dataLayerController = require("../controllers/dataLayerController");

const router = express.Router();

router.get("/", dataLayerController.getDataLayers);
router.post("/", dataLayerController.createDataLayer);

module.exports = router;