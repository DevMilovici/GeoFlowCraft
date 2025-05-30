const express = require("express");
const dataSetController = require("../controllers/dataSetController");

const router = express.Router();

router.get('/', dataSetController.getDataSets);
router.get('/:id', dataSetController.getDataSet);
router.post('/', dataSetController.createDataSet);
router.put('/', dataSetController.updateDataSet);
router.delete('/', dataSetController.deleteDataSet);
router.delete('/datalayer', dataSetController.removeDataLayer);

module.exports = router;