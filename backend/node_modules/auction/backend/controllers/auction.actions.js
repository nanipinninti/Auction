const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Auction = require("../models/auction.model");
const axios = require("axios");

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

const PickSet = async (req, res) => {
    const auction = req.auction;
    let { set_no } = req.body;

    try {
        if (set_no && set_no !== -1) {
            // Manual mode: Check if the specified set exists
            const set_no_existed = auction.sets.some(
                (set) => set.set_no.toString() === set_no.toString()
            );

            if (!set_no_existed) {
                return res.status(400).json({ message: "Set doesn't exist" });
            }

            // Set the current set to the specified set_no
            auction.auction_details.current_set = set_no;
        } else {
            // Automatic mode: Pick the next available set
            const api = `http://127.0.0.1:${process.env.PORT}/auction-details/remaining-sets?auction_id=${auction._id}`
            const response = await axios.get(
                api
            );

            const sets_info = response.data; // axios returns data in the `data` property
            const remaining_sets = sets_info.sets.filter(
                (set) => set.status !== "Completed"
            );

            if (remaining_sets.length === 0) {
                // No remaining sets, end the auction
                return res.status(201).json({
                    success: false,
                    message: "All sets are completed",
                    code: "end-auction",
                });
            } else {
                // Set the current set to the first remaining set
                auction.auction_details.current_set = remaining_sets[0].set_no;
            }
        }

        // Save the updated auction details
        await auction.save();

        res.status(201).json({
            success: true,
            message: "Successfully picked the set",
            cur_set_no : auction.auction_details.current_set
        });
    } catch (error) {
        console.error("Error while picking the set:", error.message);

        // Handle specific errors
        if (error.response) {
            // The request was made and the server responded with a status code outside 2xx
            return res.status(error.response.status).json({
                success: false,
                message: "Error from external API",
                error: error.response.data,
            });
        } else if (error.request) {
            // The request was made but no response was received
            return res.status(500).json({
                success: false,
                message: "No response from external API",
                error: error.message,
            });
        } else {
            // Something happened in setting up the request
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    }
};

const SendPlayer = async (req,res)=>{
    const auction = req.auction;
    if (auction.status !== "ongoing"){
        return res.status(201).json({
            success: false,
            message : "Auction is not ongoing. It might completed or paused or not yet started!",
            code : "start-auction"
        });
    }
    try {
        const current_set_no = auction.auction_details.current_set
        const players = auction.players
            .filter(player => {
                const setNoMatch = player.set_no.toString() === current_set_no.toString();
                const statusMatch = player.status === "Available";
                return setNoMatch && statusMatch;
            })
            .map(player => ({ player_id: player._id, base_price: player.base_price }));
        
        if (players.length === 0){
            return res.status(201).json({
                success: false,
                message : "Players are completed in this set",
                code : "pick-new-set"
            });
        }
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

//  There is a bug that even though franchise not having enough purse, it can bid. 
const RaiseBid = async (req,res)=>{
    const auction = req.auction;
    const {amount} = req.body

    if (auction.status !== "ongoing"){
        return res.status(201).json({
            success: false,
            message : "Auction is not ongoing. It might completed or paused or not yet started!",
            code : "start-auction"
        });
    }

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

// Here theere is an bug, we need to check whether franchise exist or not (simple bug)
const RaiseBidByAuctioneer = async (req,res)=>{
    const auction = req.auction;
    const {amount} = req.body
    req.franchise_id = req.body.franchise_id

    if (auction.status !== "ongoing"){
        return res.status(201).json({
            success: false,
            message : "Auction is not ongoing. It might completed or paused or not yet started!",
            code : "start-auction"
        });
    }

    try {
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
    const {auction_id , method} = req.body;
    const auctioneer_id = req.auctioneer_id; 

    try {
        if (!auction_id ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find auction
        const auction = await Auction.findOne({ _id: auction_id });
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }
        if (auction.status !== "ongoing"){
            return res.status(201).json({
                success: false,
                message : "Auction is not ongoing. It might completed or paused or not yet started!",
                code : "start-auction"
            });
        }
        // Validate auctioneer
        if (!method && method !== "auto"){
            const isValidAuctioneer = auction.auctioneers.some(
                (obj) => obj.auctioneer_id.toString() === auctioneer_id
            );
            if (!isValidAuctioneer) {
                return res.status(403).json({
                    message: "Invalid Auctioneer, this is not your auction",
                });
            }
        }
        // Find player
        const player_id = auction.auction_details.current_player

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
        const franchise_id = auction.auction_details.current_franchise

        if (franchise_id === "#"){
            player.status = "Unsold"; 
            await auction.save();
            return res.status(201).json({
                message: `Player ${player.player_name} is UnSold`,
                sold : false
            });
            

        }
        const franchise = auction.franchises.find(
            (franchise) => franchise.franchise_id.toString() === franchise_id
        );
        if (!franchise) {
            return res.status(403).json({
                message: "Franchise is not registered for the Auction",
            });
        }

        // Update player and franchise details
        const sold_price = auction.auction_details.current_bid
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
            message: `Player ${player.player_name} successfully sold to `,
            sold : true,
            franchise_id
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
    const {auction_id,method} = req.body
    const auctioneer_id = req.auctioneer_id; 
    try {
        const auction = await Auction.findOne({_id : auction_id})

        if (auction.status !== "ongoing"){
            return res.status(201).json({
                success: false,
                message : "Auction is not ongoing. It might completed or paused or not yet started!",
                code : "start-auction"
            });
        }
        // Validate auctioneer
        if (!method && method !== "auto"){
            const isValidAuctioneer = auction.auctioneers.some(
                (obj) => obj.auctioneer_id.toString() === auctioneer_id
            );
            if (!isValidAuctioneer) {
                return res.status(403).json({
                    message: "Invalid Auctioneer, this is not your auction",
                });
            }
        }
        const player_id = auction.auction_details.current_player
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

    if (auction.status !== "ongoing"){
        return res.status(201).json({
            success: false,
            message : "Auction is not ongoing. It might completed or paused or not yet started!",
            code : "start-auction"
        });
    }

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


module.exports = { SoldPlayer,SendPlayer,StartAuction ,PickSet,PauseAuction,EndAuction,RaiseBid,UnSoldPlayer,RaiseBidByAuctioneer};
