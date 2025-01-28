const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Auction = require("../models/auction.model");


const StartAuction = async (req, res) => {
    const auction = req.auction;

    try {
        // Modify and save the auction
        auction.status = "ongoing";
        await auction.save();

        res.status(201).json({
            success: true,
            message: "Auction started successfully",
        });
    } catch (error) {
        console.error("Error starting the auction:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const PauseAuction = async (req, res) => {
    const auction = req.auction;

    try {
        // Modify and save the auction
        auction.status = "pause";
        await auction.save();

        res.status(201).json({
            success: true,
            message: "Auction paused successfully",
        });
    } catch (error) {
        console.error("Error pausing the auction:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const PickSet = async (req,res)=>{
    const auction = req.auction;
    const {set_no} = req.body
    if (!set_no){        
        return res.status(400).json({ message: "Set Number is missing" });
    }
    try {
        const set_no_existed = auction.sets.some(set=>set.set_no === set_no.toString())
        if (!set_no_existed){        
            return res.status(400).json({ message: "Set doesn't existed" });
        }
        auction.current_set = set_no
        await auction.save()
        
        res.status(201).json({
            success: true
        });
    } catch (error) {
        console.error("Error while picking the set :", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const SendPlayer = async (req,res)=>{
    const auction = req.auction;
    try {
        const current_set_no = auction.auction_details.current_set
        const players = auction.players
                .filter(player=>player.set_no === current_set_no && player.status === "Available")
                .map(player=>({player_id : player._id,base_price : player.base_price}))

        const randomPlayer = players[Math.floor(Math.random() * players.length)];

        auction.auction_details.current_player = randomPlayer.player_id
        auction.auction_details.current_bid = randomPlayer.base_price        
        auction.auction_details.current_franchise = "#"

        await auction.save()
        
        res.status(201).json({
            success: true,
            player_id : randomPlayer.player_id
        });
    } catch (error) {
        console.error("Error Sending Next Player :", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const RaiseBid = async (req,res)=>{
    const auction = req.auction;
    const {amount} = req.body
    try {
        if (amount <= auction.auction_details.current_bid){
            return res.status(500).json({
                success: false,
                message: "Biddedd by other frnachise!"
            });
        }
        if (auction.auction_details.current_franchise===req.franchise_id){
            return res
            .status(500).json({
                success: false,
                message: "Can't bid conseuctively"
            });
        }
        auction.auction_details.current_bid = amount
        auction.auction_details.current_franchise = req.franchise_id
        await auction.save()        
        res.status(201).json({
            success: true
        });
    } catch (error) {
        console.error("Error Raising the bid :", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const SoldPlayer = async (req, res) => {
    const { franchise_id, auction_id, sold_price, player_id } = req.body;
    const auctioneer_id = req.auctioneer_id; 

    try {
        if (!franchise_id || !auction_id || !sold_price || !player_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find auction
        const auction = await Auction.findOne({ _id: auction_id });
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        // Validate auctioneer
        const isValidAuctioneer = auction.auctioneers.some(
            (obj) => obj.auctioneer_id.toString() === auctioneer_id
        );

        if (!isValidAuctioneer) {
            return res.status(403).json({
                message: "Invalid Auctioneer, this is not your auction",
            });
        }

        // Find player
        const player = auction.players.find(
            (player) => player._id.toString() === player_id
        );
        if (!player) {
            return res
                .status(403)
                .json({ message: "Player is not registered in this Auction!" });
        }

        if (player.status === "Sold") {
            return res
                .status(403)
                .json({ message: "Player is already sold out!" });
        }
        
        // Find franchise
        const franchise = auction.franchises.find(
            (franchise) => franchise.franchise_id.toString() === franchise_id
        );
        if (!franchise) {
            return res.status(403).json({
                message: "Franchise is not registered for the Auction",
            });
        }

        // Update player and franchise details
        if (franchise.total_purse - franchise.spent < sold_price){            
            return res
                .status(403)
                .json({ message: "Insufficient Purse!" });
        }
        player.sold_price = sold_price;
        player.status = "Sold";

        franchise.players = franchise.players || [];
        franchise.spent = franchise.spent || 0;

        franchise.players.push(player_id);
        franchise.spent += sold_price;

        // Save changes
        await auction.save();

        res.status(201).json({
            message: `Player ${player.player_name} successfully sold to ${franchise_id}`,
        });

    } catch (error) {
        console.error("Error selling Player:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const UnSoldPlayer = async (req,res)=>{
    const auction = req.auction;
    const {player_id} = req.body
    if (!player_id || !amount) {
        return res.status(400).json({ message: "Player id is missing!" });
    }
    try {
        const player = auction.players.find(
            (player) => player._id.toString() === player_id
        );

        if (!player) {
            return res
                .status(403)
                .json({ message: "Player is not registered in this Auction!" });
        }

        player.status = "Unsold"
        await auction.save()        
        res.status(201).json({
            success: true
        });
    } catch (error) {
        console.error("Error while un-solding the player :", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const EndAuction = async (req, res) => {
    const auction = req.auction;

    try {
        // Modify and save the auction
        auction.status = "completed";
        await auction.save();

        res.status(201).json({
            success: true,
            message: "Auction completed successfully",
        });
    } catch (error) {
        console.error("Error completing the auction:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


module.exports = { SoldPlayer,SendPlayer,StartAuction ,PauseAuction,EndAuction,RaiseBid,UnSoldPlayer};


// const StartAuction = async (req,res)=>{
//     const {auction_id} = req.body
//     const auctioneer_id = req.auctioneer_id
//     if (!auction_id) {
//         return res.status(400).json({ message: "All fields are required" });
//     }
//     try {
//         const auction = await Auction.findOne({_id : auction_id})
//         if (!auction){
//             res.status(500).json({
//                 success: false,
//                 message: "Auction doesn't existed"
//             });
//         }
//         if (!auction.auctioneers.some(obj=>obj.auctioneer_id.toString()===auctioneer_id.toString())){
//             res.status(500).json({
//                 success: false,
//                 message: "Unauthorized Auctioneer"
//             });
//         }


//         await auction.save()
        
//         res.status(201).json({
//             success: true
//         });
//     } catch (error) {
//         console.error("Error To Start the Auction :", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// }
