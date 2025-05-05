const express = require("express");
const {SoldPlayer,SendPlayer,PickSet,StartAuction,PauseAuction,EndAuction,RaiseBid,UnSoldPlayer,RaiseBidByAuctioneer} = require("../controllers/auction.actions");
const {verifyAuctioneerToken} = require("../middleware/auctioneer.token.verification")
const {verifyFranchiseToken} = require("../middleware/franchise.token.verification")
const {validateAuctionAuctioneer,validateAuctionFranchise} = require("../middleware/validate.auction")
const router = express.Router();

router.post("/sold-player", verifyAuctioneerToken,SoldPlayer);
router.post("/un-sold-player", verifyAuctioneerToken,UnSoldPlayer);
router.post("/start-auction", verifyAuctioneerToken,validateAuctionAuctioneer,StartAuction);
router.post("/pick-set", verifyAuctioneerToken,validateAuctionAuctioneer,PickSet);
router.post("/pause-auction", verifyAuctioneerToken,validateAuctionAuctioneer,PauseAuction);
router.post("/end-auction", verifyAuctioneerToken,validateAuctionAuctioneer,EndAuction);
router.post("/send-player", verifyAuctioneerToken,validateAuctionAuctioneer,SendPlayer);
router.post("/raise-bid", verifyFranchiseToken,validateAuctionFranchise,RaiseBid);
router.post("/raise-bid-by-auctioneer", verifyAuctioneerToken,validateAuctionAuctioneer,RaiseBidByAuctioneer);



module.exports = router;