const express = require("express");
const {UpcomingAuctions,CompletedAuctions,LiveAuctions} = require("../controllers/home")
const router = express.Router();

router.get("/upcoming",UpcomingAuctions)
router.get("/completed",CompletedAuctions)
router.get("/live",LiveAuctions)

module.exports = router;