const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  set_name: { type: String, required: true}, 
  set_no: { type: Number, required: true }
});

module.exports = setSchema;
