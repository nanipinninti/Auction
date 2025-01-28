const express = require("express");
const {addAuction,addSets,addFranchises,addAuctioneers} = require("../controllers/add.auction")
const {getAuctionList,getAuctionDetailsByAuctionId,getFranchiseDetails} = require('../controllers/get.auction')
const {verifyCustomerToken} = require("../middleware/customer.token.verification")
const uploadAuctionImage = require("../middleware/upload.auction.image")
const router = express.Router();

router.post("/add-auction",verifyCustomerToken,uploadAuctionImage,addAuction)
router.post("/add-sets",verifyCustomerToken,addSets)
router.post("/add-franchises",verifyCustomerToken,addFranchises)
router.post("/add-auctioneers",verifyCustomerToken,addAuctioneers)

router.get("/auction-list",getAuctionList)
router.get("/detailsbyid",getAuctionDetailsByAuctionId)
router.get("/franchises",getFranchiseDetails)

module.exports = router;