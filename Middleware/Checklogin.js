
const checklogin = (req, res, next) => {
    const myCookie = req.cookies.jwttoken;
    if (!myCookie || myCookie.expires < Date.now()) {
        res.status(401).send({
            "message":"Session expired. Please login again."
        });
    } else {
        next();
    }
}

module.exports = { checklogin };
