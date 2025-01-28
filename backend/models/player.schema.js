const mongoose = require('mongoose');
const Stats = require('./stat.schema'); 

const playerSchema = new mongoose.Schema({
    set_no: { type: Number, required: true },
    player_name: { type: String, required: true },
    base_price: { type: Number, required: true },
    age: { type: Number, required: true },
    country: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Available', 'Sold','Unsold'], 
        default: 'Available' 
    },
    Type: { 
        type: String, 
        enum: ['batter', 'bowler', 'allrounder', 'keeper'], 
        required: true 
    },
    sold_price: { type: Number, default: 0 },
    stats: { type: Stats } // Correctly reference the Stats schema
});

module.exports = playerSchema;