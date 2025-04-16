const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = async (req,res,next)=>{
    try {
        // console.log(req.cookies);
        
        const token = req.cookies.accessToken;
        if(!token){
            return res.status(401).json({
                message:'User not authenticated',
                success:false
            });
        }
        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decode){
            return res.status(401).json({
                message:'Invalid',
                success:false
            });
        }
        req.id = decode._id;
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = isAuthenticated;
