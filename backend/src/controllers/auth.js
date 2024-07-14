const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const registerVendor = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const vendor = await User.findOne({ email });
    if (vendor) {
      return res.status(400).json({ message: "Vendor already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new User({
      name,
      email,
      password: hashedPassword,
      role: "stall",
    });

    await newVendor.save();
    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "1h",
    });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({
      message: "Login successful!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { registerVendor, registerUser, login };
