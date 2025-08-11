const express = require("express");
const multer = require('multer');
const fs = require('fs');
const dataLayerController = require("../controllers/dataLayerController");
const serverConfig = require("../config/serverConfig");
const router = express.Router();

// Ensure uploads folder exists
const uploadDir = serverConfig.baseUploadPath;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 2000 * 1024 * 1024, // 2000 MB per file
    fields: 20,                 // max non-file fields
    files: 1,                   // expecting one file field named "file"
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/tiff',
      'image/tif',       // Non-standard but some apps use it
      'text/csv',
      'application/zip',
      'application/x-zip-compressed'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type. Allowed: TIFF, CSV, ZIP'));
    }
    cb(null, true);
  },
});


router.get("/", dataLayerController.getDataLayers);
router.get("/:id", dataLayerController.getDataLayer);
/**
 * POST /
 * Expects:
 * - file field:       "file" (Blob/File)
 * - metadata field:   "metadata" (JSON string)
 */
router.post("/", upload.single('file'), dataLayerController.createDataLayer);
router.delete('/', dataLayerController.deleteDataLayer);

module.exports = router;