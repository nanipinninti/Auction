const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin.model'); // Ensure correct path
const generateAdminToken = require("../utils/admin.token")

// Login API
const login = async (req, res) => {
    const { admin_name, password } = req.body;
    try {
        if (!admin_name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if admin exists
        const admin = await Admin.findOne({ admin_name });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token and set it as a cookie
        generateAdminToken(res, admin._id);

        // Remove password from the response (optional)
        const adminResponse = { ...admin._doc, password: undefined };

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            admin: adminResponse,
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
    const { admin_name, password } = req.body;
    try {
        if (!admin_name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ admin_name });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new Admin({
            admin_name,
            password: hashedPassword
        });

        // Save admin to the database
        await newAdmin.save();

        // Generate token and set it as a cookie
        generateAdminToken(res, newAdmin._id);

        // Remove password from the response (optional)
        const adminResponse = { ...newAdmin._doc, password: undefined };

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: adminResponse,
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
    res.cookie('admin_token', '', {
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
