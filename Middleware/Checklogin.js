
const checklogin = (req, res, next) => {
    const myCookie = req.cookies.jwttoken;  
    console.log(req.cookies)
    // const myCookie = req.cookies.jwt;  
    if(!myCookie) {
        res.status(401).send({
            "message":"Please login first."
        });
    } else if (myCookie.expires < Date.now()) {    
        res.status(401).send({
            "message":"Session expired. Please login again."
        });
    } else {
        res.status(200).send({
            "message":`User has cookie ${myCookie}`
        });
        next();
    }
}

module.exports = { checklogin };
