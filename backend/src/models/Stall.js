const mongoose = require("mongoose");

const stallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    meat: {
      type: Number,
      required: true,
    },
    vegetable: {
      type: Number,
      required: true,
    },
    fish: {
      type: Number,
      required: true,
    },
    misc: {
      type: Number,
      required: false,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        comment: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stall", stallSchema);
