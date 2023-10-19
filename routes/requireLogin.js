const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const dotenv = require("dotenv");
dotenv.config();
const user = mongoose.model("UserChurchApp")
module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //authorization === Bearer ewefwegwrherhe
    if(!authorization){
       return res.status(401).json({error:"you must be logged in auth error"})
    }
    const token = authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET,(err, user) => {
        if (err) res.status(403).json("Token is not valid!");
        req.user = user;
        next();
   
    })
}
//extra code for filtering access
// const verifyToken = (req, res, next) => {
//     const authorization = req.headers;
//     if (authorization) {
//       const token = authHeader.split(" ")[1];
//       jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) res.status(403).json("Token is not valid!");
//         req.user = user;
//         next();
//       });
//     } else {
//       return res.status(401).json("You are not authenticated!");
//     }
//   };
  
//   const verifyTokenAndAuthorization = (req, res, next) => {
//     verifyToken(req, res, () => {
//       if (req.user.id === req.params.id || req.user.isAdmin) {
//         next();
//       } else {
//         res.status(403).json("You are not alowed to do that!");
//       }
//     });
//   };
  
//   const verifyTokenAndAdmin = (req, res, next) => {
//     verifyToken(req, res, () => {
//       if (req.user.isAdmin) {
//         next();
//       } else {
//         res.status(403).json("You are not alowed to do that!");
//       }
//     });
//   };
  
//   module.exports = {
//     verifyToken,
//     verifyTokenAndAuthorization,
//     verifyTokenAndAdmin,
//   };
  
// const token = authorization.replace("Bearer ","")
// jwt.verify(token,JWT_SECRET, (err,payload)=>{
//     if(err){
//      return   res.status(401).json({error:"you must be logged in!!!"})
//     }

//     const {_id} = payload
//     const userdata = User.findById(_id)
//     req.user = userdata
//     next()  
    