const Stall = require("../models/Stall");
const axios = require("axios");

const getGeocode = async (address) => {
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
    throw new Error("Geocoding API error");
  }
};

const createStall = async (req, res) => {
  const { name, address, hours, meat, vegetable, fish, misc } = req.body;
  try {
    const geoLocation = await getGeocode(address); // converts address to geolocation
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : []; // upload multiple images

    const newStall = new Stall({
      name,
      address,
      hours,
      location: {
        type: "Point",
        coordinates: [geoLocation.lng, geoLocation.lat],
      },
      meat,
      vegetable,
      fish,
      misc,
      images,
    });
    await newStall.save();
    res.status(201).json(newStall);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllStalls = async (req, res) => {
  try {
    const stalls = await Stall.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "stall",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $project: {
          reviews: 0, // exclude reviews as we only want ratings
        },
      },
    ]);

    // Generate HTML for each stall
    const htmlResponse = stalls
      .map(
        (stall) => `
      <div class="stall-card" onclick="viewStallDetails('${stall._id}')">
        <img src="${
          stall.images && stall.images.length > 0
            ? `http://127.0.0.1:5001/api${stall.images[0]}`
            : "/path/to/default/image.jpg"
        }" alt="${stall.name}" class="stall-image" />
        <div class="stall-details">
          <p><strong>Name:</strong> ${stall.name}</p>
          <p><strong>Address:</strong> ${stall.address}</p>
          <p><strong>Operating Hours:</strong> ${stall.hours}</p>
          <p><strong>Average Rating:</strong> ${
            stall.averageRating
              ? stall.averageRating.toFixed(1)
              : "No ratings yet"
          }</p>
        </div>
      </div>
    `
      )
      .join("");

    res.send(htmlResponse); // Send HTML response
  } catch (error) {
    console.error(error);
    res.status(500).send(`<p>Server error: ${error.message}</p>`);
  }
};

const updateStall = async (req, res) => {
  const { name, address, hours, meat, vegetable, fish, misc } = req.body;
  const images = req.files ? req.files.map((file) => file.filename) : [];

  try {
    const updatedStall = await Stall.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
        hours,
        location: {
          type: "Point",
          coordinates: [geolocation.lng, geoLocation.lat],
        },
        meat,
        vegetable,
        fish,
        misc,
        images,
      },
      { new: true }
    );
    if (!updatedStall) {
      return res.json(404).json({ message: "Stall not found" });
    }
    res.json(updatedStall);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteStall = async (req, res) => {
  try {
    const deletedStall = await Stall.findByIdAndDelete(req.params.id);

    if (!deletedStall) {
      return res.status(404).json({ message: "Stall not found" });
    }
    res.json({ messge: "Stall deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getStallById = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);

    if (!stall) {
      return res.status(404).send(`<p>Stall not found</p>`);
    }

    // Generate HTML for the specific stall
    const htmlResponse = `
      <div class="stall-card">
        <img src="${
          stall.images && stall.images.length > 0
            ? `http://127.0.0.1:5001/api${stall.images[0]}`
            : "/path/to/default/image.jpg"
        }" alt="${stall.name}" class="stall-image" />
        <div class="stall-details">
          <p><strong>Name:</strong> ${stall.name}</p>
          <p><strong>Address:</strong> ${stall.address}</p>
          <p><strong>Operating Hours:</strong> ${stall.hours}</p>
          <p><strong>Average Rating:</strong> ${
            stall.averageRating
              ? stall.averageRating.toFixed(1)
              : "No ratings yet"
          }</p>
        </div>
      </div>
    `;

    res.send(htmlResponse); // Send HTML response
  } catch (error) {
    console.error(error);
    res.status(500).send(`<p>Server error: ${error.message}</p>`);
  }
};

const searchStalls = async (req, res) => {
  const { query } = req.query;
  try {
    const stalls = await Stall.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { hours: { $regex: query, $options: "i" } },
      ],
    });

    // Generate HTML for search results
    const htmlResponse = stalls
      .map(
        (stall) => `
      <div class="stall-card" onclick="viewStallDetails('${stall._id}')">
        <img src="${
          stall.images && stall.images.length > 0
            ? `http://127.0.0.1:5001/api${stall.images[0]}`
            : "/path/to/default/image.jpg"
        }" alt="${stall.name}" class="stall-image" />
        <div class="stall-details">
          <p><strong>Name:</strong> ${stall.name}</p>
          <p><strong>Address:</strong> ${stall.address}</p>
          <p><strong>Operating Hours:</strong> ${stall.hours}</p>
          <p><strong>Average Rating:</strong> ${
            stall.averageRating
              ? stall.averageRating.toFixed(1)
              : "No ratings yet"
          }</p>
        </div>
      </div>
    `
      )
      .join("");

    res.send(htmlResponse); // Send HTML response
  } catch (error) {
    console.error(error);
    res.status(500).send(`<p>Server error: ${error.message}</p>`);
  }
};

const findNearbyStalls = async (req, res) => {
  const { lat, lng, distance } = req.query;

  if (!lat || !lng || !distance) {
    return res
      .status(400)
      .send(`<p>Latitude, longitude, and distance are required</p>`);
  }

  const parsedDistance = parseFloat(distance);

  if (isNaN(parsedDistance)) {
    return res.status(400).send(`<p>Invalid distance parameter</p>`);
  }

  try {
    const stalls = await Stall.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parsedDistance / 6378.1, // radius of Earth in km
          ],
        },
      },
    });

    // Generate HTML for nearby stalls
    const htmlResponse = stalls
      .map(
        (stall) => `
      <div class="stall-card" onclick="viewStallDetails('${stall._id}')">
        <img src="${
          stall.images && stall.images.length > 0
            ? `http://127.0.0.1:5001/api${stall.images[0]}`
            : "/path/to/default/image.jpg"
        }" alt="${stall.name}" class="stall-image" />
        <div class="stall-details">
          <p><strong>Name:</strong> ${stall.name}</p>
          <p><strong>Address:</strong> ${stall.address}</p>
          <p><strong>Operating Hours:</strong> ${stall.hours}</p>
          <p><strong>Average Rating:</strong> ${
            stall.averageRating
              ? stall.averageRating.toFixed(1)
              : "No ratings yet"
          }</p>
        </div>
      </div>
    `
      )
      .join("");

    res.send(htmlResponse); // Send HTML response
  } catch (error) {
    console.error(error);
    res.status(500).send(`<p>Server error: ${error.message}</p>`);
  }
};

module.exports = {
  createStall,
  getAllStalls,
  updateStall,
  deleteStall,
  getStallById,
  searchStalls,
  findNearbyStalls,
};
