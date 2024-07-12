const express = require("express");
const router = express.Router();
const { login, registerVendor, registerUser } = require("../controllers/auth");

router.post("/Vendor-register", registerVendor);
router.post("/User-register", registerUser);
router.post("/login", login);

module.exports = router;
