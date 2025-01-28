const express = require("express");
const {SoldPlayers,UnSoldPlayers,TopBuys,CurrentStatus,GetSets,PlayerDetails} = require("../controllers/auction.details")
const router = express.Router();

router.get("/sold-players",SoldPlayers);
router.get("/un-sold-players",UnSoldPlayers);
router.get("/top-buys",TopBuys);
router.get("/status",CurrentStatus);
router.get("/sets",GetSets);
router.get("/player",PlayerDetails);

module.exports = router;