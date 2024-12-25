const express = require("express");
const workspaceController = require("../controllers/workspaceController");

const router = express.Router();

router.post('/workspaces', workspaceController.createWorkspace);
router.get('/workspaces', workspaceController.getWorkspaces);
// TODO: Show we implement this route
// router.get('/workspaces/:id', workspaceController.getWorkspace);
router.put('/workspaces', workspaceController.updateWorkspace);
router.delete('/workspaces/:name', workspaceController.deleteWorkspace);

module.exports = router;