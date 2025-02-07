const express = require("express");
const {SoldPlayer,SendPlayer,PickSet,EndAuction,UnSoldPlayer} = require("../controllers/auction.actions");
const {validateAuctionAuctioneer,validateAuctionFranchise} = require("../middleware/validate.auction")
const router = express.Router();

router.post("/sold-player",SoldPlayer);
router.post("/un-sold-player",UnSoldPlayer);
router.post("/pick-set",validateAuctionAuctioneer,PickSet);
router.post("/end-auction",validateAuctionAuctioneer,EndAuction);
router.post("/send-player",validateAuctionAuctioneer,SendPlayer);



module.exports = router;