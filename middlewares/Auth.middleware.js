const jwt = require("jsonwebtoken");

// Middleware to protect routes
const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting 'Bearer TOKEN'

  if (!token) return res.status(401).json({ success: false, message: "Access denied, token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    req.user = decoded; // store decoded user info in request
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = {authToken};
