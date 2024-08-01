const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const User = require("../src/models/User");

const mongoURI = process.env.DATABASE;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs and gridfsBucket
let gfs, gridfsBucket;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  console.log("GridFS initialized");
});

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

const getFileByFilename = async (req, res) => {
  console.log("Received request to get file:", req.params.filename);
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      const readstream = gridfsBucket.openDownloadStream(file._id);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  } catch (err) {
    console.error("Error finding file:", err);
    res.status(500).json({
      err: "Server error",
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    await gridfsBucket.delete(new mongoose.Types.ObjectId(req.params.filename));
    res.json({ msg: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({
      err: "Server error",
    });
  }
};

const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract filename from profilePictureUrl
    const filename = user.profilePictureUrl.split("/").pop();

    // Find the file by filename
    const file = await gfs.files.findOne({ filename });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete the file from GridFS
    await gridfsBucket.delete(file._id);

    // Update user's profile picture URL
    user.profilePictureUrl = undefined;
    await user.save();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadProfilePicture,
  getFileByFilename,
  deleteFile,
  deleteProfilePicture,
};
