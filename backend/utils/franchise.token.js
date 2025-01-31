const jwt = require("jsonwebtoken")
const generateFranchiseToken  = (res,_id)=>{
    const token = jwt.sign({_id},
        process.env.FRANCHISE_JWT_TOKEN,
        {expiresIn : "3d"}
    )
    return token
}
module.exports = generateFranchiseToken