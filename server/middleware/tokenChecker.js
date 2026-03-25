const jwt = require("jsonwebtoken")
const SECRET="MyProject@233"

module.exports=(req,res, next)=>{
    let token= req.headers.authorization 
    if(!token){
         res.json({
             status:403,
             success:false,
             message:"No token found!!"
         })
    }else{
         jwt.verify(token,SECRET, (err, decoded)=>{
             if(!!err){
                 res.json({
                     status:403,
                     success:false,
                     message:"Token not valid"
                 })
             }else{
                    req.decoded=decoded 
                    next()
                              
             }
         
         
         })
     }
 }