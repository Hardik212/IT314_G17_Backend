// require jwt
const jwt = require('jsonwebtoken'); 


const checklogin = (req, res, next) => {
    const myCookie = req.cookies.token;  
    if(!myCookie || myCookie.expires < Date.now()) {      // no cookie generated or cookie expired
        res.status(401).send({
            "message":"Session expired. Please login again."
        });
    } 
    else{
        try{
            const decoded = jwt.verify(myCookie, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch(err){
            console.log(err);
            res.status(401).send({
                "message":"Please login again."
            });
        }
    }
     
}


// const checklogin = (req, res, next) => {
//     const myCookie = req.cookies.jwttoken;  
//     console.log(req.cookies)
//     // const myCookie = req.cookies.jwt;  
//     if(!myCookie) {
//         res.status(401).send({
//             "message":"Please login first."
//         });
//     } 
//     else if (myCookie.expires < Date.now()) {    
//         res.status(401).send({
//             "message":"Session expired. Please login again."
//         });
//     } else{
//         console.log(`User has cookie ${myCookie}`)  
//         next();        
//     }         
// }

module.exports = { checklogin };
