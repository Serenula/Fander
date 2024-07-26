const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const User = require("../src/models/User");

const mongoURI = process.env.DATABASE;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Init gfs
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
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

const getFileByFilename = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
};

const deleteFile = (req, res) => {
  gfs.remove({ filename: req.params.filename, root: "uploads" }, (err) => {
    if (err) {
      return res.status(404).json({ err });
    }
    res.json({ msg: "File deleted successfully" });
  });
};

module.exports = {
  uploadProfilePicture,
  getFileByFilename,
  deleteFile,
};
