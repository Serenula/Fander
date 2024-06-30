const mongoose = require("mongoose");

const StallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    dishes: [
      {
        type: String,
      },
    ],
    cost: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        users: { types: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        comment: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stall", StallSchema);
