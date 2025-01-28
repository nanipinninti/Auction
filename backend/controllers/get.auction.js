const express = require("express")
const Auction = require("../models/auction.model")
const mongoose = require('mongoose');

const getAuctionList = async (req,res)=>{
    try{
        const auctions = await Auction.find({})
        const result = auctions.map(obj => ({
            _id: obj._id,
            auction_name: obj.auction_name,
            auction_date: obj.auction_date,
            auction_time: obj.auction_time
        }));
        
        return res.status(201).json({
            message : "Success",
            auction_list : result
        })
    }catch(error){
        console.log("Error : ",error)
        return res.status(201).json({
            message : "Internval Servor Error"
        })
    }

}


const getAuctionDetailsByAuctionId = async (req, res) => {
    try {
        const { auction_id } = req.query; // Extract the auction_id from query paramete

        // Step 1: Validate if auction_id is provided
        if (!auction_id) {
            return res.status(400).json({ error: 'Auction ID is required' });
        }

        // Step 2: Check if auction_id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(auction_id)) {
            return res.status(400).json({ error: 'Invalid Auction ID format' });
        }

        // Step 3: Convert string auction_id to ObjectId
        const objectId = new mongoose.Types.ObjectId(auction_id);

        // Step 4: Query the database
        const auction = await Auction.findOne({ _id: objectId });

        // Step 5: Handle case where auction is not found
        if (!auction) {
            return res.status(404).json({ error: 'Auction not found' });
        }

        // Step 6: Return the found auction
        res.status(200).json(auction);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getFranchiseDetails = async (req,res)=>{
    const {auction_id} = req.query
    if (!auction_id) {
        return res.status(400).json({ error: 'Auction ID is required' });
    }
    try{
        const objectId = new mongoose.Types.ObjectId(auction_id);
        const auction = await Auction.findOne({_id:objectId})

        if(!auction){
            return res.status(404).json({ error: 'Auction not found' });
        }
        const franchises = await Auction.aggregate([
            {
                $match: {
                    _id: objectId
                }
            },
            {
                $unwind: "$franchises"
            },
            {
                $lookup: {
                    from: "franchises",
                    localField: "franchises.franchise_id",
                    foreignField: "_id",
                    as: "Franchise"
                }
            },
            {
                $unwind: "$Franchise"
            },
            {
                $project: {
                    _id: "$Franchise._id",
                    franchise_name: "$Franchise.franchise_name",
                    franchise_url: "$Franchise.franchise_url",
                    owner_name: "$Franchise.owner_name"
                }
            }
        ]);
        
        // Transform into a map using _id as the key
        const franchiseMap = franchises.reduce((acc, item) => {
            const { _id, ...rest } = item;
            acc[_id] = rest; // Use _id as the key and the rest of the fields as the value
            return acc;
        }, {});
    
        return res.status(200).json(franchiseMap)
    }catch(error){
        console.log("Error : ",error)
        return res.status(201).json({
            message : "Internval Servor Error"
        })
    }
}

module.exports = {getAuctionList,getAuctionDetailsByAuctionId,getFranchiseDetails}