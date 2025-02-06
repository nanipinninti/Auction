const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    admin_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model('admin', adminSchema,'admin');
module.exports = Admin;