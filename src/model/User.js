const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      requried: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user, admin"],
      deafult: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
