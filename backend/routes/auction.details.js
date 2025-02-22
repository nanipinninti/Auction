const express = require("express");
const {SoldPlayers,UnSoldPlayers,TopBuys,CurrentStatus,GetSets,RemainingSets,PlayerDetails,AvailablePlayers} = require("../controllers/auction.details")
const router = express.Router();

router.get("/sold-players",SoldPlayers);
router.get("/un-sold-players",UnSoldPlayers);
router.get("/top-buys",TopBuys);
router.get("/status",CurrentStatus);
router.get("/sets",GetSets);
router.get("/remaining-sets",RemainingSets);
router.get("/player",PlayerDetails);
router.get("/next-players",AvailablePlayers);

module.exports = router;