const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader) {
    return res.status(400).json({ status: "error", message: "No token found" });
  }

  const token = authorizationHeader.replace("Bearer", "").trim();

  if (!token) {
    return res.status(403).json({ status: "error", message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin" && req.user.role !== "superAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = adminAuth;
