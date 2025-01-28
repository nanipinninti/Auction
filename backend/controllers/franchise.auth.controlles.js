const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Franchise = require("../models/franchise.model")
const generateFranchiseToken = require("../utils/franchise.token")

// Login API
const login = async (req, res) => {
    const { franchise_name, password } = req.body;
    try {
        if (!franchise_name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if admin exists
        const franchise = await Franchise.findOne({ franchise_name });
        if (!franchise) {
            return res.status(404).json({ message: 'Franchise not found' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, franchise.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token and set it as a cookie
        const franchise_token = generateFranchiseToken(res, franchise._id);

        // Remove password from the response (optional)
        const franchiseResponse = { ...franchise._doc, password: undefined };

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            franchise: franchiseResponse,
            franchise_token
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
    const { franchise_name, franchise_url,owner_name,password } = req.body;
    try {
        if (!franchise_name || !password || !owner_name ) {
            return res.status(400).json({ message: "All franchise fields are required" });
        }

        // Check if admin already exists
        const existingFranchise = await Franchise.findOne({ franchise_name });
        if (existingFranchise) {
            return res.status(400).json({ message: 'Franchise already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newFranchise = new Franchise({
            franchise_name,
            franchise_url,
            owner_name,
            password : hashedPassword
        });

        // Save admin to the database
        await newFranchise.save();

        // Generate token and set it as a cookie
        generateFranchiseToken(res, newFranchise._id);

        // Remove password from the response (optional)
        const franchiseResponse = { ...newFranchise._doc, password: undefined };

        res.status(201).json({
            success: true,
            message: "Franchise registered successfully",
            franchise: franchiseResponse,
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
    res.cookie('franchise_token', '', {
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
