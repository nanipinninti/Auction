const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Customer = require('../models/customer.model'); // Ensure correct path
const generateCustomerToken = require("../utils/customer.token")

// Login API
const login = async (req, res) => {
    const { customer_name, password } = req.body;
    try {
        if (!customer_name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if customer exists
        const customer = await Customer.findOne({ customer_name });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token and set it as a cookie
        const customer_token = generateCustomerToken(res, customer._id);

        // Remove password from the response (optional)
        const customerResponse = { ...customer._doc, password: undefined };

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            customer: customerResponse,
            customer_token
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
    const { customer_name, password } = req.body;
    try {
        if (!customer_name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ customer_name });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new customer
        const newCustomer = new Customer({
            customer_name,
            password: hashedPassword
        });

        // Save customer to the database
        await newCustomer.save();

        // Generate token and set it as a cookie
        generateCustomerToken(res, newCustomer._id);

        // Remove password from the response (optional)
        const customerResponse = { ...newCustomer._doc, password: undefined };

        res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            customer: customerResponse,
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
    res.cookie('customer_token', '', {
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
