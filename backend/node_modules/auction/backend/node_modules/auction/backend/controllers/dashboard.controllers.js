const Auction = require("../models/auction.model")

const GetAllAuctions = async (req,res)=>{
    const {status} = req.query  
    // customer_id
    try{
        const auctions = 
        (status === "all" || !status) ?
            await Auction.find({customer_id : req.customer_id  }).
            select("auction_name description short_name auction_img auction_date auction_time status")
            :        
            await Auction.find({customer_id : req.customer_id,status  }).
            select("auction_name description short_name auction_img auction_date auction_time status")

        return res
        .status(201)
        .json({message : "Success",auctions})
        
    }catch(error){
        console.log("Error while getting all Auctions",error)
        return res
        .status(401)
        .json({message : "Failed",error})
    }
}
module.exports = {GetAllAuctions}