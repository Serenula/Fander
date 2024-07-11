const axios = require("axios");

const getGeocode = async (address) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status === "OK") {
      return response.data.results[0].geometry.location;
    } else {
      throw new Error(response.data.status);
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
    throw error;
  }
};

module.exports = { getGeocode };
