const express = require("express");
const {addPlayers , GetPlayerDetails ,getAllPlayerDetails,addNewPlayers} = require("../controllers/player.contollers")
const {verifyCustomerToken} = require("../middleware/customer.token.verification")
const router = express.Router();

router.post("/add",verifyCustomerToken,addPlayers)
router.post("/new-players-add",verifyCustomerToken,addNewPlayers)
router.post("/details",GetPlayerDetails)
router.get("/all",getAllPlayerDetails)

module.exports = router;