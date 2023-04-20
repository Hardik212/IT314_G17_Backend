const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var validator = require("email-validator");
dotenv = require('dotenv').config();
// const profilePicData = require('../data/Profilepic.json');   // doubt on this one

// import models of DB
const User = require('../models/User');

const UserProfile = async (req, res) => {      
    const username = req.params.username;
    const userId = req.decoded.userId;
    try {
        const currUserProfile = await User.findOne({_id: userId});
        if(currUserProfile.username != username){
            return res.status(401).send({
                "message":"You are not authorized to view this profile."
            });
        }
        else{
            res.status(200).send({
                "message":"User profile displayed successfully.",
                "data": currUserProfile
            });
        }   
    } catch(err){
        res.status(500).send({
            "message":"Error displaying user profile.",
            "error": err
        });
    }
};

const UpadteProfile = async (req, res) => {

    const uID = req.params.id;
    const currUser = req.body;

    if(currUser.password){
        return res.status(400).send({
            "message":"Currently not authrized to change the password."
        });
    }

    //validate the phone number
        if ( currUser.phone){
            if(isNaN(currUser.phone) || currUser.phone.length != 10) {
                return res.status(400).send({
                    "message":"Please enter a valid phone number"
                });
            }
        }   

    // validate the email by library
    if(currUser.email){
        const isvalidEmail = validator.validate(currUser.email);
        if (!isvalidEmail) {
            return res.status(400).send({"message":"Please enter a valid email."});
        }    
    } 
    
    // encrypt the password if it is changed
    // if(currUser.password){
    //     const salt = await bcrypt.genSalt(10);
    //     const hashedPassword = await bcrypt.hash(currUser.password, salt);
    //     currUser.password = hashedPassword;
    // }

    // update the user object into the database
    User.findByIdAndUpdate(uID,currUser, {new:true})
        .then((user) => {
            res.status(200).send({
                "message":"User profile Updated successfully.",
                "user": user,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                "message":"Error updating user profile.",
                "error": err
            });
        });
   
};


// make follow user function
const followUser = async (req, res) => {
    const userId = req.decoded.userId;
    const followId = req.params.id;

    // check if the user is a valid user
    if(!User.findById(userId)){
        return res.status(400).send({
            "message":"User does not exist."
        });
    }

    // check if the followId exists in the database
    if(!User.findById(followId)){
        return res.status(400).send({
            "message":"Target user does not exist."
        });
    }

    // check if the user is trying to follow himself
    if(userId == followId){
        return res.status(400).send({
            "message":"You cannot follow yourself."
        });
    }

    // check if the user is already following the target user
    following_list = User.findById(userId).following;
    if(following_list.includes(followId)){
        return res.status(400).send({
            "message":"You are already following this user."
        });
    }

    // add the target user to the following list of the user or give error
    if(!User.findByIdAndUpdate(userId, {$push: {following: followId}})){
        return res.status(500).send({
            "message":"Error updating the following list of user."
        });
    }else {
        return res.status(200).send({
            "message":"User followed successfully."
        });
    }

    // add the user to the followers list of the target user or give error
    if(!User.findByIdAndUpdate(followId, {$push: {followers: userId}})){
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
    const unfollowId = req.params.id;

    // check if the user is a valid user
    if(!User.findById(userId)){
        return res.status(400).send({
            "message":"User does not exist."
        });
    }

    // check if the unfollowId exists in the database
    if(!User.findById(unfollowId)){
        return res.status(400).send({
            "message":"Target user does not exist."
        });
    }

    // check if the user is trying to unfollow user that he is not following
    following_list = User.findById(userId).following;
    if(!following_list.includes(unfollowId)){
        return res.status(400).send({
            "message":"You are not following this user."
        });
    }

    // remove the target user from the following list of the user or give error
    if(!User.findByIdAndUpdate(userId, {$pull: {following: unfollowId}})){
        return res.status(500).send({
            "message":"Error updating the following list of user."
        });
    }else {
        return res.status(200).send({
            "message":"User unfollowed successfully."
        });
    }

    // remove the user from the followers list of the target user or give error
    if(!User.findByIdAndUpdate(unfollowId, {$pull: {followers: userId}})){
        return res.status(500).send({
            "message":"Error updating the followers list of target user."
        });
    }else {
        return res.status(200).send({
            "message":"User unfollowed successfully."
        });
    }
};







// export the functions
module.exports = {
    UserProfile,
    UpadteProfile,
    followUser,
    unfollowUser
};
