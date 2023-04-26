dotenv = require('dotenv').config();
const User = require('../models/User');


// make follow user function
const followUser = async (req, res) => {
    const userId = req.decoded.userId;
    const followname = req.params.username;
    console.log("follow user called for "+followname);


    // find the user id of the target user from the username
    const followeduser = (await User.findOne({username: followname}));
    // check if the followname exists in the database
    if(!followeduser){
        return res.status(400).send({
            "message":"Target user does not exist."
        });
    }
    const followId = followeduser._id;
    console.log("follow id is "+followId);

    // check if the user is a valid user
    let callinguser = await User.findById(userId);    
    if(!callinguser){
        return res.status(400).send({
            "message":"User does not exist."
        });
    }


    // check if the user is trying to follow himself
    if(userId == followId){
        return res.status(400).send({
            "message":"You cannot follow yourself."
        });
    }

    // check if the user is already following the target user
    following_list = (await User.findById(userId)).following;
    if(following_list.includes(followId)){
        return res.status(400).send({
            "message":"You are already following this user."
        });
    }

    // add the target user to the following list of the user or give error
    let updateduser = await User.findByIdAndUpdate(userId, {$push: {following: followId}});
    if(!updateduser){
        return res.status(500).send({
            "message":"Error updating the following list of user."
        });
    }

    // add the user to the followers list of the target user or give error
    let updatedtarget = await User.findByIdAndUpdate(followId, {$push: {followers: userId}});
    if(!updatedtarget){
        return res.status(500).send({
            "message":"Error updating the followers list of target user."
        });
    }else {
        return res.status(200).send({
            "message":"User followed successfully."
        });
    }

};

// make unfollow user function
const unfollowUser = async (req, res) => {
    const userId = req.decoded.userId;
    const unfollowname = req.params.username;
    
    // check if the user is a valid user
    let callinguser = await User.findById(userId);    
    if(!callinguser){
        return res.status(400).send({
            "message":"User does not exist."
        });
    }
    
    // find the user id of the target user from the username
    const unfolloweduser = (await User.findOne({username: unfollowname}));
        
    // check if the followname exists in the database
    if(!unfolloweduser){
        return res.status(400).send({
            "message":"Target user does not exist." 
        });
    }
    const unfollowId = unfolloweduser._id;

    // check if the followname exists in the database
    if(!unfollowId){
        return res.status(400).send({
            "message":"Target user does not exist."
        });
    }

    // check if the user is trying to unfollow user that he is not following
    following_list = (await User.findById(userId)).following;
    if(!following_list.includes(unfollowId)){
        return res.status(400).send({
            "message":"You are not following this user."
        });
    }

    // remove the target user from the following list of the user or give error
    let updateduser = await User.findByIdAndUpdate(userId, {$pull: {following: unfollowId}});
    if(!updateduser){
        return res.status(500).send({
            "message":"Error updating the following list of user."
        });
    }

    // remove the user from the followers list of the target user or give error
    let updatedtarget = await User.findByIdAndUpdate(unfollowId, {$pull: {followers: userId}});
    if(!updatedtarget){
        return res.status(500).send({
            "message":"Error updating the followers list of target user."
        });
    }else {
        return res.status(200).send({
            "message":"User unfollowed successfully."
        });
    }
};

// make get followers function
const getFollowers = async (req, res) => {
    const userId = req.decoded.userId;

    // check if the user is a valid user
    let callinguser = await User.findById(userId);    
    if(!callinguser){
        return res.status(400).send({
            "message":"User does not exist."
        });
    }

    // get the followers list of the user
    const followers_idlist = (await User.findById(userId)).followers;
    
    // get username and name of each follower in a  list
    let followers_list = [];
    for (let i = 0; i < followers_idlist.length; i++) {
        const follower = await User.findById(followers_idlist[i]);
        followers_list.push({
            "username":follower.username,
            "name":follower.name,
            "id": follower._id
        });
    }
    // return the followers list
    return res.status(200).send({
        "followers":followers_list
    });


};

// make get following function
const getFollowing = async (req, res) => {
    const userId = req.decoded.userId;
    
    // check if the user is a valid user
    let callinguser = await User.findById(userId);    
    if(!callinguser){
        return res.status(400).send({
            "message":"User does not exist."
        });
    }

    // get the following list of the user
    const following_idlist = (await User.findById(userId)).following;

    // get username and name of each following user in a list
    let following_list = [];
    for (let i = 0; i < following_idlist.length; i++) {
        const following = await User.findById(following_idlist[i]);
        following_list.push({
            "username":following.username,
            "name":following.name,
            "id": following._id
        });
    }



    // return the following list
    return res.status(200).send({
        "following":following_list
    });

};



module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
};
