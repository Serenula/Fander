const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsForStall,
  interactWithReview,
  replyToReview,
  deleteReview,
} = require("../controllers/review");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.post("/create", auth, createReview);
router.get("/:stallId", getReviewsForStall);
router.post("/:reviewId/interact", auth, interactWithReview);
router.post("/:reviewId/reply", auth, replyToReview);
router.delete("/:reviewId", adminAuth, deleteReview);

module.exports = router;
