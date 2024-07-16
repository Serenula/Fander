const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  changeUserRole,
} = require("../controllers/admin");
const auth = require("../middleware/auth");
const superAdminAuth = require("../middleware/superAdminAuth");
const adminAuth = require("../middleware/adminAuth");
const { createAdmin } = require("../controllers/admin");

router.get("/users", auth, adminAuth, getAllUsers);
router.get("/users/:id", auth, adminAuth, getUserById);
router.put("/users/:id", auth, adminAuth, updateUserById);
router.delete("/users/:id", auth, adminAuth, deleteUserById);
router.put("/users/:id/role", auth, adminAuth, changeUserRole);
router.post("/", auth, superAdminAuth, createAdmin);

module.exports = router;
