const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
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
    next();
  } catch (error) {
    const refreshToken = req.headers["x-refresh-token"];

    if (!refreshToken) {
      return res
        .status(401)
        .json({ msg: "Token is not valid and no refresh token provided" });
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      );

      const newAccessToken = jwt.sign(
        { userId: decodedRefresh.userId, role: decodedRefresh.role },
        process.env.ACCESS_SECRET,
        { expiresIn: "1h" }
      );

      res.setHeader("Authorization", `Bearer ${newAccessToken}`);
      req.user = decodedRefresh;
      next();
    } catch (refreshError) {
      console.error("Refresh token failed to validate:", refreshError);
      return res.stauts(401).json({ msg: "Refresh token is not valid" });
    }
  }
};

module.exports = auth;
