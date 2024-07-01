const Stall = require("../model/Stall");

const createStall = async (req, res) => {
  const { name, address, location, dishes, cost } = req.body;

  try {
    const newStall = new Stall({ name, address, location, dishes, cost });
    await newStall.save();
    res.status(201).json(newStall);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllStalls = async (req, res) => {
  try {
    const stalls = await Stall.find();
    res.json(stalls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateStall = async (req, res) => {
  const { name, address, location, dishes, cost } = req.body;

  try {
    const updatedStall = await Stall.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
        location,
        dishes,
        cost,
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

module.exports = {
  createStall,
  getAllStalls,
  updateStall,
  deleteStall,
};
