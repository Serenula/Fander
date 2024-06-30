const express = require("express");
const {
  createStall,
  getAllStalls,
  updateStall,
  deleteStall,
} = require("../controllers/stall");
const auth = require("../middleware/auth");

const router = express.Router;

router.post("/", auth, createStall);
router.get("/", getAllStalls);
router.put("/:id", auth, updateStall);
router.delete("/:id", auth, deleteStall);

module.exports = router;
