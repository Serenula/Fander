const express = require("express");
const router = express.Router();
const {
  createStall,
  getAllStalls,
  updateStall,
  deleteStall,
  getStallById,
  searchStalls,
  findNearbyStalls,
} = require("../controllers/stall");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.get("/", auth, getAllStalls);
router.get("/search", auth, searchStalls);
router.get("/nearby", auth, findNearbyStalls);
router.get("/:id", auth, getStallById);
router.post("/create", adminAuth, createStall);
router.put("/:id", adminAuth, updateStall);
router.delete("/:id", adminAuth, deleteStall);

module.exports = router;
