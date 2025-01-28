const express = require("express");
const {addPlayers , GetPlayerDetails} = require("../controllers/player.contollers")
const {verifyCustomerToken} = require("../middleware/customer.token.verification")
const router = express.Router();

router.post("/add",verifyCustomerToken,addPlayers)
router.post("/details",GetPlayerDetails)

module.exports = router;