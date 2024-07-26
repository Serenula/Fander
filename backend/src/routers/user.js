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
  upload,
} = require("../controllers/user");
const auth = require("../middleware/auth");

router.get("/profile", auth, getUserProfile);
router.put("/edit", auth, updateUserProfile);
router.put("/change-password", auth, changePassword);
router.put("/deactivate", auth, deactivateUserAccount);
router.put("/reactivate", auth, reactivateUserAccount);
router.post(
  "/profile-picture",
  auth,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.delete("/profile-picture", auth, deleteProfilePicture);

module.exports = router;
