const express = require("express");
const dataLayerController = require("../controllers/dataLayerController");

const router = express.Router();

router.get("/", dataLayerController.getDataLayers);
router.get("/:id", dataLayerController.getDataLayer);
router.post("/", dataLayerController.createDataLayer);
router.delete('/', dataLayerController.deleteDataLayer);

module.exports = router;