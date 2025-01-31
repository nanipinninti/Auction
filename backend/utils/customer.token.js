const jwt = require("jsonwebtoken")
const generateCustomerToken  = (res,_id)=>{
    const token = jwt.sign({_id},
        process.env.CUSTOMER_JWT_TOKEN,
        {expiresIn : "3d"}
    )
    return token
}
module.exports = generateCustomerToken