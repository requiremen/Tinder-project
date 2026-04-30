const jwt = require("jsonwebtoken");
function authmiddleware(req,res,next){
    const token = req.headers.token;
    const decoded = jwt.verify(token,"secretkey");
    if(decoded){
        req.userid = decoded.userid
        req.username = decoded.username
        next();
    }
    else{
        return res.status(401).json({
            msg:"unauthorized access"
        })
    }
}
module.exports = {
    authmiddleware:authmiddleware
}
