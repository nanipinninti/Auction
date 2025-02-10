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
            .map(({ _id, auction_name, auction_date, auction_time, auction_img, status, description, short_name }) => {
                try {
                    // Ensure auction_date is a Date object
                    const auctionDate = new Date(auction_date); 
                    if (isNaN(auctionDate.getTime())) throw new Error(`Invalid date: ${auction_date}`);

                    // Construct full auction date-time
                    const [hours, minutes] = auction_time.split(":").map(Number);
                    auctionDate.setHours(hours, minutes, 0, 0); // Set hours and minutes

                    return { _id, auction_name, auction_img, status,auction_date, description, short_name, auctionDate };
                } catch (err) {
                    console.error(err.message);
                    return null; // Skip invalid auctions
                }
            })
            .filter(auction => auction !== null) // Remove invalid auctions
            .filter(auction => {
                return currentTime >= auction.auctionDate && auction.status !== "completed";
            });

        return res.status(200).json({ message: "Success", live_auctions });

    } catch (error) {
        console.error("Error while getting ongoing Auctions", error);
        return res.status(500).json({ message: "Failed", error });
    }
};





module.exports = {UpcomingAuctions,CompletedAuctions,LiveAuctions}
