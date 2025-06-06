const jwt = require("jsonwebtoken")
const generateAdminToken  = (res,_id)=>{
    const token = jwt.sign({_id},
        process.env.ADMIN_JWT_TOKEN,
        {expiresIn : "3d"}
    )
    res.cookie("admin_token_", token, {
        httpOnly: true,
        sameSite: "None",
        secure : true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    return token
}
module.exports = generateAdminToken