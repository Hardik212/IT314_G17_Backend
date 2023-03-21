const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const checklogin = (req, res, next) => {
    const myCookie = req.cookies.token;
    
    if (!myCookie || myCookie.expires < Date.now()) {
        return res.status(401).send({
            "message":"Session expired. Please login again."
        });
    }else{
        try{
            const decoded = jwt.verify(myCookie, process.env.JWT_SECRET);
            req.decoded = decoded;
            next();
        }
        catch(err){
            res.status(401).send({
                "message":"Bahot chalak ho beta"
            });

        } 
    }
     
}

module.exports = { checklogin };
