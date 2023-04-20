// require jwt
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv').config();
const jwt_decode = require('jwt-decode');

const checklogin = (req, res, next) => {
    const myCookie = req.body.token;
    if(!myCookie) {      // no cookie generated or cookie expired
        return res.status(401).send({
            "error":"Please provide cookie token."
        });
    } 
    else{
        try{
            const decoded = jwt_decode(myCookie);
            if(decoded.exp < Date.now()/1000){
                return res.status(401).send({
                    "message":"Please login again."
                });
            }
            req.decoded = decoded;
            next();
        } catch(err){
            console.log(err);
            res.status(401).send({
                "message":"Please login again."
            });
        }
    }
     
}

module.exports = { checklogin };
