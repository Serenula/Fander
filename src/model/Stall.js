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
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Changed 'types' to 'type'
        rating: { type: Number, required: true },
        comment: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Define geospatial index for location field
stallSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Stall", stallSchema);
