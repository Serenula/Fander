const express = require("express");
const router = express.Router();
const {
  createStall,
  getAllStalls,
  updateStall,
  deleteStall,
} = require("../controllers/stall");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.get("/", auth, getAllStalls);
router.post("/create", auth, adminAuth, createStall);
router.put("/:id", auth, adminAuth, updateStall);
router.delete("/:id", auth, adminAuth, deleteStall);

module.exports = router;
