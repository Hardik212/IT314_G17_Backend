const User = require('../models/User');
const Poll = require('../models/Polls');
const Question = require('../models/Question');
dotenv = require('dotenv').config();


// make function to get all users
const getAllUsers = async (req, res) => {
    
    // check if the admin is a valid user and is an admin
    let admin = await User.findById(req.decoded.userId);
    if(!admin || admin.role != "admin"){
        return res.status(400).send({
            "message":"You are not authorized to perform this action."
        });
    }

    try {
        const allUsers = await User.find();
        res.status(200).send({
            "message":"All users fetched successfully.",
            "data": allUsers
        });
    } catch(err){
        res.status(500).send({
            "errormessage":"Error fetching all users.",
            "error": err
        });
    }

};

// make function to get all polls
const getAllPolls = async (req, res) => {
    const {pollid} = req.body;
    // check if the admin is a valid user and is an admin
    let admin = await User.findById(req.decoded.userId);
    if(!admin || admin.role != "admin"){
        return res.status(400).send({
            "errormessage":"You are not authorized to perform this action."
        });
    }
    

    try {
        const allPolls = await Poll.findById(pollid);
        let polldetails=[];
        const creatoruser = await User.findById(allPolls.creator);
        polldetails.push(creatoruser);
        polldetails.push(allPolls);
        console.log(allPolls);
        res.status(200).send({
            "message":"All polls fetched successfully.",
            "data": polldetails
        });
    } catch(err){
        res.status(500).send({
            "errormessage":"Error fetching all polls.",
            "error": err
        });
    }
};

module.exports = {
    getAllUsers,
    getAllPolls
};