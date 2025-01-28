const jwt = require("jsonwebtoken")
const generateAuctioneerToken  = (res,_id)=>{
    const token = jwt.sign({_id},
        process.env.AUCTIONEER_JWT_TOKEN,
        {expiresIn : "3d"}
    )
    res.cookie("auctioneer_token", token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
          //   console.log("Generated TOken : " ,token)
    //   console.log("Key used to generate : ",process.env.AUCTIONEER_JWT_TOKEN);
      
    return token
}
module.exports = generateAuctioneerToken