require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./src/db/db");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB();

const app = express();

//Middleware
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/api/auth", require("./src/routers/auth"));
app.use("/api/stalls", require("./src/routers/stall"));

//Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Server Error!" });
});

//PORT
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server sarterd on${PORT}`);
});
