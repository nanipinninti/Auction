const express = require("express");
const {SoldPlayer,SendPlayer,StartAuction,PauseAuction,EndAuction,RaiseBid} = require("../controllers/auction.actions");
const {verifyAuctioneerToken} = require("../middleware/auctioneer.token.verification")
const {verifyFranchiseToken} = require("../middleware/franchise.token.verification")
const {validateAuctionAuctioneer,validateAuctionFranchise} = require("../middleware/validate.auction")
const router = express.Router();

router.post("/sold-player", verifyAuctioneerToken,SoldPlayer);
router.post("/start-auction", verifyAuctioneerToken,validateAuctionAuctioneer,StartAuction);
router.post("/pause-auction", verifyAuctioneerToken,validateAuctionAuctioneer,PauseAuction);
router.post("/end-auction", verifyAuctioneerToken,validateAuctionAuctioneer,EndAuction);
router.post("/send-player", verifyAuctioneerToken,validateAuctionAuctioneer,SendPlayer);
router.post("/raise-bid", verifyFranchiseToken,validateAuctionFranchise,RaiseBid);

module.exports = router;