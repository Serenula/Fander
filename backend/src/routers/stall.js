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

const setCORPHeader = require("../middleware/setCORPHeader");
const { uploadMultiple } = require("../../services/gridfsStorage");

router.get("/", auth, getAllStalls);
router.get("/search", auth, searchStalls);
router.get("/nearby", auth, findNearbyStalls);
router.get("/:id", auth, setCORPHeader, getStallById);
router.post("/create", adminAuth, uploadMultiple, createStall);
router.put("/:id", adminAuth, uploadMultiple, updateStall);
router.delete("/:id", adminAuth, deleteStall);

module.exports = router;
