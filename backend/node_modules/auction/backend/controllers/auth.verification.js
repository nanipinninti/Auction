const Auction = require("../models/auction.model");

const AuctioneerVerification = async (req, res) => {
    const { auction_id } = req.query; // Corrected: req.params is an object, not a function

    try {
        const auction = await Auction.findOne({ _id: auction_id }).select("auctioneers");

        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction not found",
            });
        }

        const valid = auction.auctioneers.some(auctioneer => auctioneer.auctioneer_id.toString() === req.auctioneer_id.toString());

        if (valid) {
            return res.status(200).json({
                success: true,
                mode: "auctioneer",
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "Auctioneer is not part of this auction",
            });
        }
    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const FranchiseVerification = async (req,res)=>{
    const { auction_id } = req.query; // Corrected: req.params is an object, not a function
    try {
        const auction = await Auction.findOne({ _id: auction_id }).select("franchises");
        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction not found",
            });
        }

        const valid = auction.franchises.some(franchise => franchise.franchise_id.toString() === req.franchise_id.toString());

        if (valid) {
            return res.status(200).json({
                success: true,
                mode: "franchise",
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "Franchise is not part of this auction",
            });
        }
    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const CustomerVerification = async (req,res)=>{
    const {auction_id}  = req.query; // Corrected: req.params is an object, not a function
    try {
        const auction = await Auction.findOne({ _id: auction_id }).select("customer_id");
        if (!auction) {
            return res.status(404).json({ 
                success: false,
                message: "Auction not found",
            });
        }

        if (auction.customer_id.toString() === req.customer_id.toString()) {
            return res.status(200).json({
                success: true,
                mode: "customer",
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "Customer is not part of this auction",
            });
        }
    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = { AuctioneerVerification, FranchiseVerification, CustomerVerification };