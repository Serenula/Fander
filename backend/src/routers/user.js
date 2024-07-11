const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deactivateUserAccount,
  reactivateUserAccount,
} = require("../controllers/user");
const auth = require("../middleware/auth");

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.put("/change-password", auth, changePassword);
router.put("/deactivate", auth, deactivateUserAccount);
router.put("/reactivate", auth, reactivateUserAccount);

module.exports = router;
