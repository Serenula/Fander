const express = require("express");
const {
  uploadProfilePicture,
  getFileByFilename,
  deleteFile,
} = require("../../services/fileHandler");
const upload = require("../../services/gridfsStorage");
const auth = require("../middleware/auth");
const setCORPHeader = require("../middleware/setCORPHeader");

const router = express.Router();

// Upload profile picture
router.post(
  "/upload",
  auth,
  upload.single("profilePicture"),
  uploadProfilePicture
);

// Get file by filename
router.get("/:filename", setCORPHeader, getFileByFilename);

// Delete file by filename
router.delete("/:filename", auth, deleteFile);

module.exports = router;
