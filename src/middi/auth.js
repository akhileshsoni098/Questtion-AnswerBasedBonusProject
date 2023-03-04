const jwt = require("jsonwebtoken")
const authentication = (req,res)=>{
let token = req.headers["x-auth-token"]
jwt.verify(token, "secrateKey", function(decoded,err){
if(err){
    res.status(401).send({status:false , message:err.message})
}
else{
    req.userId = decoded.userId
    next()
}
})
}