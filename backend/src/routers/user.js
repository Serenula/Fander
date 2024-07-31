const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deactivateUserAccount,
  reactivateUserAccount,
  uploadProfilePicture,
  deleteProfilePicture,
} = require("../controllers/user");
const auth = require("../middleware/auth");
const { uploadSingle } = require("../../services/gridfsStorage");

const setCORPHeader = require("../middleware/setCORPHeader");

router.get("/profile", auth, setCORPHeader, getUserProfile);
router.put("/edit", auth, updateUserProfile);
router.put("/change-password", auth, changePassword);
router.put("/deactivate", auth, deactivateUserAccount);
router.put("/reactivate", auth, reactivateUserAccount);
router.post("/profile-picture", auth, uploadSingle, uploadProfilePicture);
router.delete("/profile-picture", auth, deleteProfilePicture);

module.exports = router;
