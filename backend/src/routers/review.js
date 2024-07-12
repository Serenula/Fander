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

router.post("/", auth, createReview);
router.get("/stall/:stallId", getReviewsForStall);
router.post("/:reviewId/interact", auth, interactWithReview);
router.post("/:reviewId/reply", auth, replyToReview);
router.delete("/:reviewId", auth, adminAuth, deleteReview);

module.exports = router;
