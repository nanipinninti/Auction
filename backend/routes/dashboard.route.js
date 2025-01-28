const express = require("express");
const {GetAllAuctions} = require("../controllers/dashboard.controllers")
const {verifyCustomerToken} = require("../middleware/customer.token.verification")
const router = express.Router();

router.get("/auctions",verifyCustomerToken,GetAllAuctions)

module.exports = router;