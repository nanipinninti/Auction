const express = require("express")
const Auction = require("../models/auction.model")

const UpcomingAuctions = async (req,res)=>{
    try{
        const auctions = await Auction.find({})
        const upcomingAuctions = auctions
        .map(({ _id, auction_name, auction_date,short_name, auction_img,status,description }) => ({ _id, auction_name,short_name,description, auction_date, auction_img,status }))
        .filter(auction => auction.status==="upcoming");
        return res
        .status(201)
        .json({message : "Success",upcomingAuctions})
        
    }catch(error){
        console.log("error while getting Upcoming Auctions list",error)
        return res
        .status(401)
        .json({message : "Failed",error})
    }
}

const CompletedAuctions = async (req,res)=>{
    try{
        const auctions = await Auction.find({})
        const completedAuctions = auctions
        .map(({ _id, auction_name, auction_date,description,short_name, auction_img,status }) => ({ _id, auction_name, short_name,description,auction_date, auction_img,status }))
        .filter(auction => auction.status==="completed");
        return res
        .status(201)
        .json({message : "Success",completedAuctions})
        
    }catch(error){
        console.log("error while getting completed Auctions list",error)
        return res
        .status(401)
        .json({message : "Failed",error})
    }
}

const LiveAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({});

        const currentTime = new Date(); // Get current date and time

        const live_auctions = auctions
            .map(({ _id, auction_name, auction_date, auction_img, status, description, short_name }) => 
                ({ _id, auction_name, auction_date, auction_img, status, description, short_name })
            )
            .filter(auction => {
                const auctionTime = new Date(auction.auction_date); // Convert auction date to Date object
                return auctionTime <= currentTime && auction.status !== "completed";
            });

        return res.status(200).json({ message: "Success", live_auctions });

    } catch (error) {
        console.log("Error while getting ongoing Auctions", error);
        return res.status(500).json({ message: "Failed", error });
    }
};

module.exports = {UpcomingAuctions,CompletedAuctions,LiveAuctions}
