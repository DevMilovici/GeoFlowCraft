const express = require("express");
const layerController = require("../controllers/layerController");

const router = express.Router();

router.post('/layers', layerController.createLayer)
router.get('/layers', layerController.getLayers);

module.exports = router;