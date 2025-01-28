const express = require("express");
const storeController = require("../controllers/storeController");

const router = express.Router();

router.post('/stores', storeController.createStore);
router.get('/stores/:workspaceName', storeController.getStores);
// TODOs
// router.get('/stores/:name', storeController.getstore);
// router.put('/stores', storeController.updatestore);
// router.delete('/stores/:name', storeController.deletestore);

module.exports = router;