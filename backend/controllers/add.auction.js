const express = require('express');
const mongoose = require('mongoose');
const Auction = require('../models/auction.model');
const router = express.Router();


const addAuction = async (req, res) => {
    try {
        const customer_id = req.customer_id; // From the authenticated customer
        const { short_name,auction_name, auction_date, auction_time, players = [], franchises = [], sets = [] ,description} = req.body;

        // Check for required fields (auction_name, auction_date, etc.)
        if (!auction_name || !auction_date || !auction_time || !short_name ) {
            return res.status(400).json({ message: 'Missing required fields: auction_name, auction_date, auction_time' });
        }
        const auction = await Auction.findOne({auction_name : auction_name})
        if (auction){
            throw new Error("Please change Auction Name")
        }
        // Create a new auction document
        const newAuction = new Auction({
            customer_id,
            auction_name,
            auction_date,
            short_name,
            auction_img : req.auction_img_url,
            description,
            auction_time,
            players, 
            franchises, 
            sets
        });

        // Save the auction to the database
        await newAuction.save();

        // Return the newly created auction in the response
        res.status(201).json({
            message: 'Auction created successfully!',
            auction: newAuction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating auction', error: error.message });
    }
};


const addSets = async (req, res) => {
    const { setData, auction_id } = req.body; // `setData` contains new set data to append
    const customer_id = req.customer_id;     // Authenticated customer's ID

    try {
        // Step 1: Find the auction by auction_id
        const auction = await Auction.findOne({ _id: auction_id });
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        // Step 2: Check if the customer_id matches the auction owner
        if (auction.customer_id.toString() !== customer_id) {
            return res.status(403).json({ message: "Invalid customer, this is not your auction" });
        }

        const filterEmptyFields = setData.filter(obj => String(obj.set_no).trim() !== "" && obj.set_name.trim() !== "");


        const hasDuplicates = filterEmptyFields
            .map(item => String(item.set_no))  // Convert each set_no to a string
            .some((value, index, self) => self.indexOf(value) !== index);

        if (hasDuplicates && filterEmptyFields.length > 0) {
            return res.status(400).json({
                message: `Duplicate set_no found in the request data`
            });
        }

        // Handle empty setData
        if (filterEmptyFields.length === 0) {
            auction.sets = [];
        } else {
            auction.sets = [...filterEmptyFields];
        }

        await auction.save();

        // Step 6: Send a success response
        res.status(201).json({
            message: "Sets added successfully!",
            sets: auction.sets,
        });
    } catch (error) {
        console.error("Error during adding sets:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const addFranchises = async (req, res) => {
    const { franchiseData, auction_id } = req.body; // `franchiseData` contains new franchise data
    const customer_id = req.customer_id; // Authenticated customer's ID

    try {
        // Step 1: Find the auction by auction_id
        const auction = await Auction.findOne({ _id: auction_id });
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        // Step 2: Check if the customer_id matches the auction owner
        if (auction.customer_id.toString() !== customer_id) {
            return res.status(403).json({ message: "Invalid customer, this is not your auction" });
        }

        // Step 3: Filter out empty or invalid franchise data
        const filterEmptyFields = franchiseData.filter(
            (obj) => obj.franchise_id && obj.franchise_id.trim() !== "" && obj.total_purse !== undefined
        );

        // Step 4: Check for duplicates in the incoming franchiseData
        const franchiseIds = filterEmptyFields.map((obj) => obj.franchise_id.toString());
        const hasDuplicates = franchiseIds.some((value, index, self) => self.indexOf(value) !== index);

        if (hasDuplicates && filterEmptyFields.length > 0) {
            return res.status(400).json({
                message: `Duplicate franchise_id found in the request data`,
            });
        }

        // Step 5: Replace existing franchises with the new franchiseData
        auction.franchises = [...filterEmptyFields]; // Replace existing data with new data

        // Step 6: Save the updated auction
        await auction.save();

        // Step 7: Send a success response
        res.status(201).json({
            message: "Franchises added successfully!",
            franchises: auction.franchises,
        });
    } catch (error) {
        console.error("Error during adding franchises:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const addAuctioneers = async (req, res) => {
    const { auctioneersData, auction_id } = req.body; // `auctioneersData` contains new auctioneer data
    const customer_id = req.customer_id; // Authenticated customer's ID

    try {
        // Step 1: Find the auction by auction_id
        const auction = await Auction.findOne({ _id: auction_id });
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        // Step 2: Check if the customer_id matches the auction owner
        if (auction.customer_id.toString() !== customer_id) {
            return res.status(403).json({ message: "Invalid customer, this is not your auction" });
        }

        // Step 3: Filter out empty or invalid auctioneer data
        const filterEmptyFields = auctioneersData.filter(
            (obj) => obj.auctioneer_id && obj.auctioneer_id.trim() !== ""
        );

        // Step 4: Check for duplicates in the incoming auctioneersData
        const auctioneerIds = filterEmptyFields.map((obj) => obj.auctioneer_id.toString());
        const hasDuplicates = auctioneerIds.some((value, index, self) => self.indexOf(value) !== index);

        if (hasDuplicates && filterEmptyFields.length > 0) {
            return res.status(400).json({
                message: `Duplicate auctioneer_id found in the request data`,
            });
        }

        // Step 5: Replace existing auctioneers with the new auctioneersData
        auction.auctioneers = [...filterEmptyFields]; // Replace existing data with new data

        // Step 6: Save the updated auction
        await auction.save();

        // Step 7: Send a success response
        res.status(201).json({
            message: "Auctioneers added successfully!",
            auctioneers: auction.auctioneers,
        });
    } catch (error) {
        console.error("Error during adding auctioneers:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


const modifyAuction = async (req, res) => {
  const { id } = req.params;
  const { auction_name, short_name, description, auction_date, auction_time } = req.body;
  const auction_img = req.auction_img_url
 
  try {
    const updatedAuction = await Auction.findByIdAndUpdate(
      id,
      {
        auction_name,
        short_name,
        description,
        auction_img,
        auction_date,
        auction_time,
      },
      { new: true } // Return the updated document
    );

    if (!updatedAuction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    res.status(200).json({ success: true, data: updatedAuction });
  } catch (error) {
    console.error("Error updating auction details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {addAuction,addSets,addAuctioneers ,addFranchises,modifyAuction}
