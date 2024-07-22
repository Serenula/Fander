const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  changeUserRole,
} = require("../controllers/admin");
const superAdminAuth = require("../middleware/superAdminAuth");
const adminAuth = require("../middleware/adminAuth");
const { createAdmin } = require("../controllers/admin");

router.get("/users", adminAuth, getAllUsers);
router.get("/users/:id", adminAuth, getUserById);
router.put("/users/:id", adminAuth, updateUserById);
router.delete("/users/:id", adminAuth, deleteUserById);
router.put("/users/:id/role", adminAuth, changeUserRole);
router.post("/", superAdminAuth, createAdmin);

module.exports = router;
