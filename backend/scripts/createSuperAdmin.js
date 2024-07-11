require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../src/models/User");

const createSuperAdmin = async () => {
  const email = "superadmin@example.com";
  const password = "supersecurepassword";
  const name = "Super Admin";

  try {
    await mongoose.connect(process.env.DATABASE);

    const existingSuperAdmin = await User.findOne({ email });
    if (existingSuperAdmin) {
      console.log("Super Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "superAdmin",
    });

    await superAdmin.save();
    console.log("Super Admin created successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    mongoose.connection.close();
  }
};

createSuperAdmin();
