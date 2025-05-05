const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    matches_played: { type: Number, required: true, default: 0 },
    runs: { type: Number, required: true, default: 0 },
    avg: { type: Number, required: true, default: 0 },
    strike_rate: { type: Number, required: true, default: 0 },
    fifties: { type: Number, required: true, default: 0 },
    hundreds: { type: Number, required: true, default: 0 },
    wickets: { type: Number, required: true, default: 0 },
    bowling_avg: { type: Number, required: true, default: 0 },
    three_wicket_haul: { type: Number, required: true, default: 0 },
    stumpings : { type: Number, required: true, default: 0 },
});


module.exports = statsSchema;

