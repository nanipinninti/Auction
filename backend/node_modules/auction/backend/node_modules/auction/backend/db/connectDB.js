const mongoose = require("mongoose");

// MongoDB connection URI
const MONGO_URI = "mongodb+srv://users:nani123@cluster0.jvt0su3.mongodb.net/Auction?retryWrites=true&w=majority&appName=Cluster0";
// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
