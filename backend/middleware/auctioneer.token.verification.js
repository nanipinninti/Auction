const jwt = require("jsonwebtoken");

const verifyAuctioneerToken = (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.auctioneer_token;

    // Debugging: Log cookies to verify token extraction
    console.log("Cookies:", req.cookies);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    // Verify the token
    jwt.verify(token, process.env.AUCTIONEER_JWT_TOKEN, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: Invalid token" });
      }

      // Attach auctioneer ID to the request object
      req.auctioneer_id = decoded._id;

      // Debugging: Log the decoded token
      console.log("Decoded Token:", decoded);

      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { verifyAuctioneerToken };
