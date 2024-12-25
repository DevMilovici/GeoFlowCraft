const express = require("express");
const workspaceController = require("../controllers/workspaceController");

const router = express.Router();

router.post('/workspaces', workspaceController.createWorkspace);
router.get('/workspaces', workspaceController.getWorkspaces);
router.put('/workspaces', workspaceController.updateWorkspace);
router.delete('/workspaces/:name', workspaceController.deleteWorkspace);
// TODOs
// router.get('/workspaces/:id', workspaceController.getWorkspace);

module.exports = router;