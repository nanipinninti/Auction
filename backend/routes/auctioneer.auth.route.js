const express = require("express");
const { login,signup ,logout,auctioneersList} = require("../controllers/auctioneer.auth.controllers");
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.get("/list", auctioneersList);

module.exports = router;