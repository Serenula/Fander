const axios = require("axios");

// const getGeocode = async (req, res) => {
//   const { address } = req.query;
//   const apiKey = process.env.GOOGLE_MAPS_API_KEY;

//   try {
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//         address
//       )}&key=${apiKey}`
//     );
//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const getApiKey = (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  res.json({ apiKey });
};

module.exports = { getApiKey };
