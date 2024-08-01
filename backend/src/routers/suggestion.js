const express = require("express");
const router = express.Router();
const {
  createSuggestion,
  getAllSuggestions,
  updateSuggestionStatus,
} = require("../controllers/suggestion");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.post("/", auth, createSuggestion);
router.get("/", adminAuth, getAllSuggestions);
router.put("/:suggestionId/status", adminAuth, updateSuggestionStatus);

module.exports = router;
