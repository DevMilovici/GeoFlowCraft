const express = require("express");
const workspaceController = require("../controllers/workspaceController");

const router = express.Router();

router.post('/workspaces', workspaceController.createWorkspace);
router.get('/workspaces', workspaceController.getWorkspaces);
// TODOs
// router.get('/workspaces/:id', workspaceController.getWorkspace);
// router.put('/workspaces', workspaceController.updateWorkspace);
// router.delete('/workspaces/:id', workspaceController.deleteWorkspace);

module.exports = router;