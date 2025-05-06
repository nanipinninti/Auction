const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Customer = mongoose.model('customer', customerSchema,'customer');

module.exports = Customer;