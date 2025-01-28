const mongoose = require('mongoose');

const auctioneerSchema = new mongoose.Schema({
    auctioneer_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Auctioneer = mongoose.model('Auctioneer', auctioneerSchema);
module.exports = Auctioneer;