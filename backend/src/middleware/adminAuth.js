const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", message: "No token found" });
  }

  const token = req.headers["authorization"].replace("Bearer", "").trim();

  if (!token) {
    return res.status(403).json({ status: "error", message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
