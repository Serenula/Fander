const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
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
      return res.status(400).json({ message: "Vendor already exists" });
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
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user.id, role: user.role },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: "Login failed" });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const payload = { userId: decoded.userId, role: decoded.role };
    const newAccessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "1h",
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: "Token refresh failed" });
  }
};

module.exports = { registerVendor, registerUser, login, refresh };
