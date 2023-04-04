const express = require('express');
const router = express.Router();

// import controller functions
const {
    RegisterUser,
    LoginUser
} = require('./auth/Register');

const { UserProfile,UpadteProfile } = require('./profile/Profile');
const SendpolltoUser = require('./Polls/SendUser');


// import static controller functions
const { getUserRole } = require('./Static/UserRole');

// import middleware
const { checklogin } = require('./Middleware/Checklogin');



// define routes for authentication
router.post('/auth/register', RegisterUser);    // route to signup page
router.post('/auth/login', LoginUser);     // route to login page      
router.get('/auth/profile/:username',checklogin,UserProfile);   // check login and then show profile
router.put('/updateProfile/:id',checklogin, UpadteProfile);    // check login and then update profile

// polls and survey show routes
router.get('/:id',SendpolltoUser);



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
