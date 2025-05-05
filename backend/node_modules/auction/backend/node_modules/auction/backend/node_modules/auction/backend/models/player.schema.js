const mongoose = require('mongoose');
const Stats = require('./stat.schema'); 

const playerSchema = new mongoose.Schema({
    set_no: { type: Number, required: true },
    player_name: { type: String, required: true },
    image_url : {
        type : String,
        default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw0k5dToZQngKj1rdEls8beN&ust=1738346713876000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKiQxaSEnosDFQAAAAAdAAAAABAE"
    },
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