const express = require("express");
const router = express.Router();

// import controller functions
const { RegisterUser, LoginUser } = require("./auth/Register");

const { UserProfile, UpadteProfile, OtherUserProfile } = require("./profile/Profile");
const { removeUser, removePoll, promoteUser, demoteUser } = require("./Admin/privilages");
const { getAllUsers, getAllPolls } = require("./Admin/adminview");
const SendpolltoUser = require("./Polls/SendUser");
const {TakeUserResponse} = require("./Polls/TakeResponse");
const createPolls = require("./Polls/CreatePolls");

const {getPromotedPolls,updatePromotedPolls,removePromotedPolls} = require('./FeedPage/GetPromotedPolls');   


// import static controller functions
const { getUserRole } = require("./Static/UserRole");

// import middleware
const { checklogin } = require("./Middleware/Checklogin");

// import feed page controller functions
const getFeedItems = require('./FeedPage/GetFeedItems');

const {
  GetAllPollsByUser,
  getDetailsAboutPoll
} = require("./Analysis/GetAllPollsByUser");
const {followUser, unfollowUser, getFollowers, getFollowing} = require("./profile/follow");


// define routes for authentication
router.post("/auth/register", RegisterUser); // route to signup page
router.post("/auth/login", LoginUser); // route to login page
router.post("/auth/profile/:username", checklogin, UserProfile); // check login and then show profile
router.post("/auth/otherprofile/:username", checklogin,OtherUserProfile); // show profile of other user
router.put("/updateProfile/:id", checklogin, UpadteProfile); // check login and then update profile


// routes for admin side
router.post("/removeuser", checklogin,removeUser); // remove user
router.post("/removepoll",checklogin, removePoll); // remove poll
router.post("/promoteuser", checklogin,promoteUser); // promote user
router.post("/demoteuser", checklogin,demoteUser); // demote user

// routes for admin view
router.post("/getallusers", checklogin,getAllUsers); // get all users
router.post("/getallpolls", checklogin,getAllPolls); // get all polls


// polls and survey show routes
router.post('/getpoll/:id',SendpolltoUser);


// follewers and following routes
router.post('/follow/:username',checklogin,followUser);
router.post('/unfollow/:username',checklogin,unfollowUser);
router.post('/followers',checklogin,getFollowers);
router.post('/following',checklogin,getFollowing);


router.post('/takeresponse',TakeUserResponse);
router.post('/createpoll',createPolls); // add login check


// feed page routes feedpage + promoted polls
router.post('/feed/:num',checklogin,getFeedItems);
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
