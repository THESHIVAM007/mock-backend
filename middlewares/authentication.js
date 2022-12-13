const jwt = require("jsonwebtoken")
require("dotenv").config()

const authentication = (req, res, next) => {
    
    if(!req.headers.authorization){
        return res.send("Please login again")
    }
    const token = req.headers.authorization
    jwt.verify(token, "secret", function(err, decoded) {
            if(err){
                res.send("Please login")
            }
            else{
                req.body.unique = decoded.userId
                next()
            }
        });
}

module.exports = {authentication}