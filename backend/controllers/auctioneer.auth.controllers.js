const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Auctioneer = require('../models/auctioneer.model'); // Ensure correct path
const generateAuctioneerToken = require("../utils/auctioneer.token"); // Token generation utility

// Login API
const login = async (req, res) => {
    const { auctioneer_name, password } = req.body;
    try {
        if (!auctioneer_name || !password) {
            return res.status(400).json({ message: "All Auctioneer fields are required" });
        }

        // Check if auctioneer exists
        const auctioneer = await Auctioneer.findOne({ auctioneer_name });
        if (!auctioneer) {
            return res.status(404).json({ message: 'Auctioneer not found' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, auctioneer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token and set it as a cookie
        const auctioneer_token = generateAuctioneerToken(res, auctioneer._id);

        // Remove password from the response (optional)
        const auctioneerResponse = { ...auctioneer._doc, password: undefined };

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            auctioneer: auctioneerResponse,
            auctioneer_token
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Signup API
const signup = async (req, res) => {
    const { auctioneer_name, password } = req.body;
    try {
        if (!auctioneer_name || !password) {
            return res.status(400).json({ message: "All Auctioneer fields are required" });
        }

        // Check if auctioneer already exists
        const existingAuctioneer = await Auctioneer.findOne({ auctioneer_name });
        if (existingAuctioneer) {
            return res.status(400).json({ message: 'Auctioneer already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new auctioneer
        const newAuctioneer = new Auctioneer({
            auctioneer_name,
            password: hashedPassword
        });

        // Save auctioneer to the database
        await newAuctioneer.save();

        // Generate token and set it as a cookie
        generateAuctioneerToken(res, newAuctioneer._id);

        // Remove password from the response (optional)
        const auctioneerResponse = { ...newAuctioneer._doc, password: undefined };

        res.status(201).json({
            success: true,
            message: "Auctioneer registered successfully",
            auctioneer: auctioneerResponse,
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Logout API
const logout = (req, res) => {
    res.cookie('auctioneer_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), // Set the cookie to expire immediately
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

module.exports = { login, signup, logout };
