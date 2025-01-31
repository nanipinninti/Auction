const jwt = require("jsonwebtoken")
const generateAuctioneerToken  = (res,_id)=>{
    const token = jwt.sign({_id},
        process.env.AUCTIONEER_JWT_TOKEN,
        {expiresIn : "3d"}
    )
          //   console.log("Generated TOken : " ,token)
    //   console.log("Key used to generate : ",process.env.AUCTIONEER_JWT_TOKEN);
      
    return token
}
module.exports = generateAuctioneerToken