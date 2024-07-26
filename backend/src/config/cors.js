const cors = require("cors");

const corsOptions = {
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
};

module.exports = cors(corsOptions);
