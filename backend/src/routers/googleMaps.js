const express = require("express");
const { getGeocode, getApiKey } = require("../controllers/maps");

const router = express.Router();

router.get("/geocode", getGeocode);
router.get("/apikey", getApiKey);

module.exports = router;
