const jwt = require("jsonwebtoken");

const generateAuctioneerToken = (res, _id) => {
    const token = jwt.sign({ _id }, process.env.AUCTIONEER_JWT_TOKEN, { expiresIn: "3d" });

    res.cookie("auctioneer_token", token, {
        httpOnly: true,  // Prevents JavaScript from accessing the cookie
        sameSite: "None", // Required for cross-site cookies
        secure: false, 
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
    });

    return token;
};

module.exports = generateAuctioneerToken;