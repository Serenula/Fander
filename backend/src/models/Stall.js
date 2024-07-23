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
    hours: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stall", stallSchema);
