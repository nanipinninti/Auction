const express = require("express")
const Auction = require("../models/auction.model")

const UpcomingAuctions = async (req,res)=>{
    try{
        const auctions = await Auction.find({})
        const upcomingAuctions = auctions
        .map(({ _id, auction_name, auction_date, auction_img,status }) => ({ _id, auction_name, auction_date, auction_img,status }))
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
        .map(({ _id, auction_name, auction_date, auction_img,status }) => ({ _id, auction_name, auction_date, auction_img,status }))
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
const LiveAuctions = async (req,res)=>{
    try{
        const auctions = await Auction.find({})
        const live_auctions = auctions
        .map(({ _id, auction_name, auction_date, auction_img,status , description,short_name }) => 
                                ({ _id, auction_name, auction_date, auction_img ,status,description,short_name }))
        .filter(auction => auction.status==="ongoing" ||auction.status==="pause" );
        return res
        .status(201)
        .json({message : "Success",live_auctions})
        
    }catch(error){
        console.log("Error while getting ongoing Auctions",error)
        return res
        .status(401)
        .json({message : "Failed",error})
    }
}

module.exports = {UpcomingAuctions,CompletedAuctions,LiveAuctions}

// [
//   {
//     _id: new ObjectId('6773b8f49912d652c5d021df'),
//     customer_id: new ObjectId('67717168d71938218270f232'),
//     auction_name: 'IPL',
//     auction_date: '2025-02-11T15:30:00Z',
//     auction_time: '6:00 PM',
//     players: [
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object]
//     ],
//     franchises: [ [Object], [Object], [Object] ],
//     sets: [ [Object], [Object], [Object], [Object] ],
//     auctioneers: [ [Object], [Object] ],
//     __v: 6,
//     auction_img: '#'
//   }
// ]