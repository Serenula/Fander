const Suggestion = require("../models/Suggestion");

// Create a new suggestion
const createSuggestion = async (req, res) => {
  const { type, stallId, details } = req.body;
  const userId = req.user._id;

  try {
    const newSuggestion = new Suggestion({
      user: userId,
      type,
      stall: stallId,
      details,
    });

    await newSuggestion.save();

    res.status(201).json(newSuggestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all suggestions
const getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find().populate("user", "name");

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update suggestion status (approve/reject)
const updateSuggestionStatus = async (req, res) => {
  const { suggestionId } = req.params;
  const { status } = req.body;

  try {
    const suggestion = await Suggestion.findByIdAndUpdate(
      suggestionId,
      { status },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.json(suggestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSuggestion,
  getAllSuggestions,
  updateSuggestionStatus,
};
