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
    const geoLocation = await getGeocode(address);

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
    res.json(stalls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateStall = async (req, res) => {
  const { name, address, hours, meat, vegetable, fish, misc } = req.body;

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
    const getStall = await Stall.findById(req.params.id);

    if (!getStall) {
      return res.status(404).json({ message: "Stall not found" });
    }
    res.json(getStall);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const findNearbyStalls = async (req, res) => {
  const { lat, lng, distance } = req.query;

  if (!lat || !lng || !distance) {
    return res
      .status(400)
      .json({ message: "Latitude, longitude, and distance are required" });
  }

  const parsedDistance = parseFloat(distance);

  if (isNaN(parsedDistance)) {
    return res.status(400).json({ message: "Invalid distance parameter" });
  }

  try {
    const stalls = await Stall.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parsedDistance / 6378.1, // this is the radius of Earth in km
          ],
        },
      },
    });

    res.json(stalls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
