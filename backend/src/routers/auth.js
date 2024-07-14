const express = require("express");
const router = express.Router();
const { login, registerVendor, registerUser } = require("../controllers/auth");

router.post("/vendor-register", registerVendor);
router.post("/userregister", registerUser);
router.post("/login", login);

module.exports = router;
