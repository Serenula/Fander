const Review = require("../models/Review");
const Stall = require("../models/Stall");

const createReview = async (req, res) => {
  const { stallId, rating, comment } = req.body;
  const userId = req.user ? req.user._id : null;

  // Validate required fields
  if (!stallId || !rating || !comment || !userId) {
    console.log("Validation failed:", { stallId, rating, comment, userId });
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newReview = new Review({
      user: userId,
      stall: stallId,
      rating,
      comment,
    });

    console.log("Saving new review:", newReview);

    await newReview.save();

    console.log("Review saved, updating stall:", stallId);

    await Stall.findByIdAndUpdate(stallId, {
      $push: { reviews: newReview._id },
    });

    console.log("Stall updated with new review");

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reviews for a stall
const getReviewsForStall = async (req, res) => {
  const { stallId } = req.params;

  try {
    const reviews = await Review.find({ stall: stallId })
      .populate("user", "name")
      .populate("replies.user", "name");

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Like or dislike a review
const interactWithReview = async (req, res) => {
  const { reviewId } = req.params;
  const { action } = req.body; // action can be "like" or "dislike"
  const userId = req.user._id;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (action === "like") {
      review.likes.addToSet(userId);
      review.dislikes.pull(userId);
    } else if (action === "dislike") {
      review.dislikes.addToSet(userId);
      review.likes.pull(userId);
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await review.save();

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reply to a review
const replyToReview = async (req, res) => {
  const { reviewId } = req.params;
  const { comment } = req.body;
  const userId = req.user._id;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.replies.push({
      user: userId,
      comment,
    });

    await review.save();
    const populatedReview = await Review.findById(reviewId).populate(
      "replies.user",
      "name"
    );

    res.json(populatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Delete a review
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Remove the review from the associated stall's reviews array
    await Stall.findByIdAndUpdate(review.stall, {
      $pull: { reviews: reviewId },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createReview,
  getReviewsForStall,
  interactWithReview,
  replyToReview,
  deleteReview,
};
