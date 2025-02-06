const express = require("express");
const {AuctioneerVerification, FranchiseVerification, CustomerVerification } = require("../controllers/auth.verification")

const {verifyCustomerToken} = require("../middleware/customer.token.verification")
const {verifyFranchiseToken} = require("../middleware/franchise.token.verification")
const {verifyAuctioneerToken} = require("../middleware/auctioneer.token.verification")

const router = express.Router();

router.get("/customer",verifyCustomerToken,CustomerVerification)
router.get("/auctioneer",verifyAuctioneerToken,AuctioneerVerification)
router.get("/franchise",verifyFranchiseToken,FranchiseVerification)

module.exports = router;