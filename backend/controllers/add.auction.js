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

        // Step 3: Check for duplicate `set_no` in the existing `sets` array
        const existingSetNos = auction.sets.map((set) => set.set_no);
        for (const set of setData) {
            if (existingSetNos.includes(set.set_no)) 
                return res.status(400).json({
                    message: `Set with set_no ${set.set_no} already exists`,
                });
            
        }

        // Step 4: Append the new sets to the `sets` array
        auction.sets.push(...setData);

        // Step 5: Save the updated auction document
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

const addFranchises = async (req,res)=>{
    const {franchiseData,auction_id} = req.body
    const customer_id = req.customer_id
    try{
        const auction = await Auction.findOne({_id:auction_id})
        if (!auction){
            throw new Error("No auction found!")
        }
        if (customer_id !== auction.customer_id.toString()){
            throw new Error("Invalid customer, this is not your auction!")
        }

        const existingTeams = auction.franchises.map(obj=>obj.franchise_id.toString())
        for (const newFranchise of franchiseData){
            if (existingTeams.includes(newFranchise.franchise_id)){
                throw new Error(`${newFranchise.franchise_id} franchise already listed in thist Auction!`)
            }
        }

        auction.franchises.push(...franchiseData)
        await auction.save()
        res.status(201).json({
            message: "Franchises added successfully!",
            sets: auction.franchises,
        });
    }catch (error) {
        console.error("Error during creating Franchises :", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const addAuctioneers = async (req,res)=>{
    const {auctioneersData,auction_id} = req.body
    const customer_id = req.customer_id
    try{
        const auction = await Auction.findOne({_id:auction_id})
        if (!auction){
            throw new Error("No auction found!")
        }
        if (customer_id !== auction.customer_id.toString()){
            throw new Error("Invalid customer, this is not your auction!")
        }

        const existingAuctioneers = auction.auctioneers.map(obj=>obj.auctioneer_id.toString())
        for (const newAuctioneer of auctioneersData){
            if (existingAuctioneers.includes(newAuctioneer.auctioneer_id)){
                throw new Error(`${newAuctioneer.auctioneer_id} Auctioneer already listed in this Auction!`)
            }
        }

        auction.auctioneers.push(...auctioneersData)
        await auction.save()
        res.status(201).json({
            message: "Auctioneers added successfully!",
            auctioneers : auction.auctioneers,
        });
    }catch (error) {
        console.error("Error during adding Auctioneers :", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}



module.exports = {addAuction,addSets,addAuctioneers ,addFranchises}
