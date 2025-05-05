const express = require("express");
const {SoldPlayers,UnSoldPlayers,TopBuys,CurrentStatus,PlayersInSet,GetSets,RemainingSets,PlayerDetails,AvailablePlayers,FranchiseStatus} = require("../controllers/auction.details")
const router = express.Router();

router.get("/sold-players",SoldPlayers);
router.get("/un-sold-players",UnSoldPlayers);
router.get("/top-buys",TopBuys);
router.get("/status",CurrentStatus);
router.get("/sets",GetSets);
router.get("/remaining-sets",RemainingSets);
router.get("/franchise-status",FranchiseStatus);
router.get("/player",PlayerDetails);
router.get("/next-players",AvailablePlayers);
router.get("/players-in-set-info",PlayersInSet);

module.exports = router;