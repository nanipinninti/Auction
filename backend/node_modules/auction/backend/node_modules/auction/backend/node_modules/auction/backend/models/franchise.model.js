const mongoose = require('mongoose');

const franchiseSchema = new mongoose.Schema({
  franchise_name: { type: String, required: true, unique: true },
  franchise_url: { type: String, default: "#" },
  owner_name: { type: String, required: true },
  password: { 
    type: String,
    required : true 
  }
});


const Franchise = mongoose.model('Franchise', franchiseSchema);

module.exports = Franchise;