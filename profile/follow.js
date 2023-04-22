dotenv = require('dotenv').config();
const User = require('../models/User');


// make follow user function
const followUser = async (req, res) => {
    const userId = req.decoded.userId;
    const followname = req.params.username;
    console.log("follow user called for "+followname);

    
    // find the user id of the target user from the username
    const followId = (await User.findOne({username: followname}))._id;
    console.log("follow id is "+followId);
    // check if the followname exists in the database
    if(!followId){
        return res.status(400).send({
            "message":"Target user does not exist."
        });
    }

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
    const unfollowId = (await User.findOne({username: unfollowname}))._id;
    
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
    followers_list = (await User.findById(userId)).followers;

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
    following_list = (await User.findById(userId)).following;

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
