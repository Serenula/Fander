require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const authRouter = require("./src/routers/auth");
const userRouter = require("./src/routers/user");
const stallRouter = require("./src/routers/stall");
const adminRouter = require("./src/routers/admin");
const reviewRouter = require("./src/routers/review");
const suggestionRouter = require("./src/routers/suggestion");
const mapsRouter = require("./src/routers/googleMaps");
const errorHandler = require("./src/middleware/errorHandler");
const connectDB = require("./src/db/db");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://127.0.0.1:8080", "http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "hx-request",
      "hx-target",
      "hx-trigger",
      "hx-include",
      "hx-prompt",
      "hx-headers",
      "hx-sync",
      "hx-boosted",
      "hx-current-url",
      "x-refresh-token",
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from frontend directory
app.use(express.static("frontend"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/stalls", stallRouter);
app.use("/api/admins", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/suggestions", suggestionRouter);
app.use("/api/maps", mapsRouter);

// Error Handling
app.use(errorHandler);

// Log all requests
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] "${req.method} ${req.originalUrl}"`
  );
  next();
});

// Fallback to index.html for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "html", "index.html"));
});

// PORT
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
