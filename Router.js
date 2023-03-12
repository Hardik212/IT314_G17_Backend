const express = require('express');
const router = express.Router();

// import controller functions
const {
    RegisterUser,
    LoginUser
} = require('./auth/Register');

const { UserProfile,UpadteProfile } = require('./profile/Profile');


// import static controller functions
const { getUserRole } = require('./Static/UserRole');

// import middleware
const { checklogin } = require('./middleware/checklogin');



// define routes for authentication
router.post('/auth/register', RegisterUser);
router.post('/auth/login', LoginUser);
router.get('/auth/profile/:username',checklogin,UserProfile);
router.put('/updateProfile/:id',checklogin, UpadteProfile);
// router.put('/auth/profile/editProfile', editProfile);



// static apis
router.get('/', (req, res) => {
    res.send('Welcome to the server');
});

router.get('/userrole',getUserRole);

// static route for invalid routes
router.get('*', (req, res) => {
    res.status(404).send({
        "message": "Invalid route."
    });
});

// default route for invalid routes
router.post('*', (req, res) => {
    res.status(404).send({
        "message": "Invalid route."
    });
});

module.exports = router;
