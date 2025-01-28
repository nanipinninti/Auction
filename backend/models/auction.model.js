const mongoose = require('mongoose');
const playerSchema = require('./player.schema');
const setSchema = require('./set.schema');

const auctionSchema = new mongoose.Schema(
    {
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        auction_name: {
            type: String,
            required: true,
            unique: true
        },
        description : {
            type : String,
            default : "No Description"
        },
        short_name:{
            type : String,
            required : true
        },
        auction_img: {
            type: String,
            default: "#"
        },
        auction_date: {
            type: Date, // Changed to Date
            required: true
        },
        auction_time: {
            type: String, // Kept as String for flexibility
            required: true
        },
        players: [playerSchema],
        franchises: [
            {
                franchise_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Franchise',
                    required: true
                },
                players: [{ type: String }], // Array of strings
                total_purse: { type: Number, required: true },
                spent: { type: Number, default: 0 }
            }
        ],
        sets: [setSchema],
        auctioneers: [
            {
                auctioneer_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Auctioneer',
                    required: true
                }
            }
        ],
        status: {
            type: String,
            default: "upcoming"
        },
        bid_ratio: {
            type: Map,
            of: Number,
            default: new Map([
                ['0', 1000000],
                ['20000000', 2000000], 
                ['50000000', 2500000] 
            ])
        },        
        auction_details: {
            current_player: {
                type: String,
                default: "#"
            },
            current_bid: {
                type: Number,
                default: 0
            },
            current_franchise: {
                type: String,
                default: "#"
            },
            current_set: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields automatically
    }
);

// Custom validation for max auctioneers
auctionSchema.path('auctioneers').validate(function (value) {
    return !value || value.length <= 3;
}, 'The maximum number of auctioneers allowed is 3.');

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
