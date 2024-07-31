const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");

const mongoURI = process.env.DATABASE;

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const uploadSingle = multer({ storage }).single("profilePicture"); // Single picture
const uploadMultiple = multer({ storage }).array("images", 10); // Multiple pictures

module.exports = { uploadMultiple, uploadSingle };
