const express = require("express");
const router = express.Router();

// import controller functions
const { RegisterUser, LoginUser } = require("./auth/Register");

const { UserProfile,UpadteProfile } = require('./profile/Profile');
const SendpolltoUser = require('./Polls/SendUser');
const {TakeUserResponse} = require('./Polls/TakeResponse');   
const createPolls = require('./Polls/CreatePolls');  
const {getPromotedPolls,updatePromotedPolls,removePromotedPolls} = require('./FeedPage/GetPromotedPolls');   

// import static controller functions
const { getUserRole } = require("./Static/UserRole");

// import middleware
const { checklogin } = require("./Middleware/Checklogin");

// import feed page controller functions
const getFeedItems = require('./FeedPage/GetFeedItems');

// analysis page APIs
const {
  GetAllPollsByUser,
  getDetailsAboutPoll
} = require("./Analysis/GetAllPollsByUser");

// define routes for authentication
router.post("/auth/register", RegisterUser); // route to signup page
router.post("/auth/login", LoginUser); // route to login page
router.post("/auth/profile/:username", checklogin, UserProfile); // check login and then show profile
router.put("/updateProfile/:id", checklogin, UpadteProfile); // check login and then update profile

// polls and survey show routes
router.post('/getpoll/:id',SendpolltoUser);

router.post('/takeresponse',TakeUserResponse);
router.post('/createpoll',createPolls); // add login check


// feed page routes feedpage + promoted polls
router.post('/feed/:num',getFeedItems);
router.post('/getpromoted',checklogin,getPromotedPolls);
router.post('/updatepromoted',checklogin,updatePromotedPolls);
router.post('/removepromotedpolls',checklogin,removePromotedPolls);

//analysis page routes
router.post('/getallpollsbyuser',checklogin,GetAllPollsByUser);
router.post('/getdetailsaboutPoll',checklogin,getDetailsAboutPoll);

// static apis
router.get("/", (req, res) => {
  res.send("Welcome to the server");
});

router.get("/userrole", getUserRole);

// static route for invalid routes
router.get("*", (req, res) => {
  res.status(404).send({
    message: "Invalid route.",
  });
});

// default route for invalid routes
router.post("*", (req, res) => {
  res.status(404).send({
    message: "Invalid route.",
  });
});

module.exports = router;
