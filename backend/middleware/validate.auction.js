const Auction = require("../models/auction.model");

const validateAuctionAuctioneer = async (req, res, next) => {
    const { auction_id } = req.body;
    const auctioneer_id = req.auctioneer_id;

    if (!auction_id) {
        return res.status(400).json({ message: "Auction ID is required" });
    }

    try {
        const auction = await Auction.findOne({ _id: auction_id });
        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction does not exist",
            });
        }

        const isAuthorized = auction.auctioneers.some(
            (obj) => obj.auctioneer_id.toString() === auctioneer_id.toString()
        );

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized Auctioneer",
            });
        }

        req.auction = auction; // Attach auction to req object
        next();
    } catch (error) {
        console.error("Error validating auction:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const validateAuctionFranchise = async (req, res, next) => {
    const { auction_id } = req.body;
    const franchise_id = req.franchise_id;

    if (!auction_id) {
        return res.status(400).json({ message: "Auction ID is required" });
    }

    try {
        const auction = await Auction.findOne({ _id: auction_id });
        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction does not exist",
            });
        }

        const isAuthorized = auction.franchises.some(
            (obj) => obj.franchise_id.toString() === franchise_id.toString()
        );

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized Franchise",
            });
        }

        req.auction = auction; // Attach auction to req object
        next();
    } catch (error) {
        console.error("Error validating auction:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


module.exports = {validateAuctionAuctioneer,validateAuctionFranchise};