const bcrypt = require("bcrypt");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deactivateUserAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.json({ message: "Account deactivated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const reactivateUserAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: true });
    res.json({ message: "Account reactivated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Multer for picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePictureUrl = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ profilePictureUrl: user.profilePictureUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePictureUrl = undefined;
    await user.save();

    res.json({ message: "Profile picture deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deactivateUserAccount,
  reactivateUserAccount,
  uploadProfilePicture,
  deleteProfilePicture,
  upload,
};
