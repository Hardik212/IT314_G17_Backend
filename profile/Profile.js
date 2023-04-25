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
    const {currUser} = req.body;

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

// function to get the profile of other user
const OtherUserProfile = async (req, res) => {
    const targetUsername = req.params.username;
    const userId = req.decoded.userId;

    // check if the user is a valid user
    if(!User.findById(userId)){
        return res.status(400).send({
            "message":"You are not authorized to view this profile."
        });
    }

    // find the user of the target user from the username
    const targetUser = await User.findOne({username: targetUsername});
    if(!targetUser){
        return res.status(400).send({
            "message":"Target user does not exist."
        });
    }
    // check if the user wants to view his own profile
    if(targetUser._id == userId){
        return res.status(400).send({
            "message":"You are not authorized to view this profile."            
        });
    }


    // return the profile of the target user
    res.status(200).send({
        "message":"User profile displayed successfully.",
        "data": targetUser
    });
};

    






// export the functions
module.exports = {
    UserProfile,
    UpadteProfile,
    OtherUserProfile
};
