const jwt = require("jsonwebtoken")

const secure_token = "AImthEONEWhoCanOPENthePOWERFulCode"

const verified = (req, res, next) => {
try{
    const authToken = req.headers.authorization
    if(authToken){

        const token = authToken.split(" ")[1]
        jwt.verify(token, secure_token, (err, payload) => {
            if(err){
                res.status(400).json({ message: "Please check your Token again" });
            }else{
                req.user = payload
                next()
            }
        })
    }else{
       res.status(400).json({message: "check your token again" , data: err.message}) 
    }
}catch(err){
    res.status(400).json({message: "you can't carry out this operation", data: err.message})
}
}

module.exports = verified