const User = require('../models/User');
const Poll = require('../models/Polls');
const Question = require('../models/Question');
const Promoted = require('../models/Promoted');
dotenv = require('dotenv').config();



// make function to remove a user
const removeUser = async (req, res) => {

    // check if the admin is a valid user and is an admin : DONE
    console.log(req.decoded);
    let admin = await User.findById(req.decoded.userId);
    if(!admin || admin.role != "admin"){
        return res.status(400).send({
            "message":"You are not authorized to perform this action."
        });
    }

    const removingusername = req.body.username;

    // check if the user to be removed is a valid user : DONE
    let removinguser = await User.findOne({username: removingusername});
    if(!removinguser){
        return res.status(400).send({
            "message":"User does not exist."
        });
    }

    // check if the user to be removed is an admin : DONE
    if(removinguser.role == "admin"){
        return res.status(400).send({
            "message":"You are not authorized to perform this action."
        });
    }

    // delete coorrecsping question to particular poll and then delete the poll : DONE
   
    for(let i=0; i<removinguser.pollscreated.length; i++){
        const poll = await Poll.findById(removinguser.pollscreated[i]);
        if(poll){
            // go to its questioons
            for(let j = 0;j<poll.questions.length; j++){
                if(poll.questions[j]){
                    await Question.findOneAndDelete({
                        _id: poll.questions[j]
                    });
                }
            }
            // delete poll
            await Poll.findByIdAndDelete({
                _id:poll._id
            });
        }
    }        
    // remove user from following list of its followers
    for(let i=0; i<removinguser.followers.length; i++){
        try{
            await User.findByIdAndUpdate(removinguser.followers[i], {$pull: {following: removinguser._id}});
        } catch(err){
            res.status(500).send({
                "message":"Error removing user followers.",
                "error": err
            });
        }
    }
    
    // remove user from followers list of its following users
    for(let i=0; i<removinguser.following.length; i++){
        try{
            await User.findByIdAndUpdate(removinguser.following[i], {$pull: {followers: removinguser._id}});
        } catch(err){
                res.status(500).send({
                        "message":"Error removing user following.",
                        "error": err
                });
        }
    }
    
    
    // delete user
    await User.findByIdAndDelete({
        _id:removinguser._id
    });
    res.status(200).send({
        "message":"User and its data removed successfully!"
    })

};

// make function to remove a poll
const removePoll = async (req, res) => {
    const {pollid} = req.body;
    // check if the admin is a valid user and is an admin
    let admin = await User.findById(req.decoded.userId);
    if(!admin || admin.role != "admin"){
        return res.status(400).send({
            "message":"You are not authorized to perform this action."
        });
    }

    // check if the poll to be removed is a valid poll
    let poll = await Poll.findById(pollid);
    if(!poll){
        return res.status(400).send({
            "message":"Poll does not exist."
        });
    }

    // if the poll is promoted then remove it from the promoted polls list
    try{
        await Promoted.findOneAndDelete({
            pollid: poll._id
        });
    } catch(err){
    res.status(500).send({
        "message":"Error removing poll from promoted polls.",
        "error": err
    });
    }


    // remove the poll from the user's pollscreated list
    if(poll.creator){
        await User.findByIdAndUpdate(poll.creator, {$pull: {pollscreated: poll._id}});
    }

    // remove poll with all its questions

    // go to its questioons
    for(let j = 0;j<poll.questions.length; j++){
        if(poll.questions[j]){
            await Question.findOneAndDelete({
                _id: poll.questions[j]
            });
        }
    }
    // delete poll
    await Poll.findByIdAndDelete({
        _id:poll._id
    });

    try{
        await Poll.findByIdAndDelete({
            _id:poll._id
        });
        return res.status(200).send({
            "message":"Poll removed successfully."
        });
    } catch(err){
        res.status(500).send({
            "message":"Error removing poll.",
            "error": err
        });
    }

};

// promote a user to admin
const promoteUser = async (req, res) => {
    const {username} = req.body;

    // check if the admin is a valid user and is an admin
    let admin = await User.findById(req.decoded.userId);
    let userid = await User.findOne({username: username});
    if(!admin || admin.role != "admin"){
        return res.status(400).send({
            "message":"You are not authorized to perform this action."
        });
    }
    userid = userid._id;
    // check if the user to be promoted is a valid user
    const promotinguser = await User.findById(userid);
    if(!promotinguser){
        return res.status(400).send({
            "message":"User does not exist."
        });
    }

    // check is the user is already an admin
    if(promotinguser.role == "admin"){
        return res.status(400).send({
            "message":"User is already an admin."
        });
    }

    // promote the user
    try{
        await User.findByIdAndUpdate(promotinguser._id, {role: "admin"});
        return res.status(200).send({
            "message":"User promoted successfully."
        });
    } catch(err){
        res.status(500).send({
            "message":"Error promoting user.",
            "error": err
        });
    }

};

// demote a user to normal user
const demoteUser = async (req, res) => {
    const {username} = req.body;
    let userid = await User.findOne({username: username});
    userid = userid._id;
    // check if the admin is a valid user and is an admin
    let admin = await User.findById(req.decoded.userId);
    if(!admin || admin.role != "admin"){
        return res.status(400).send({
            "message":"You are not authorized to perform this action."
        });
    }


    // check if the user to be demoted is a valid user
    const demotinguser = await User.findById(userid);
    if(!demotinguser){
        return res.status(400).send({
            "message":"User does not exist."
        });
    }

    // check if the user is already a normal user
    if(demotinguser.role == "user"){
        return res.status(400).send({
            "message":"User is already a normal user."
        });
    }

    // demote the user
    try{
        await User.findByIdAndUpdate(demotinguser._id, {role: "user"});
        return res.status(200).send({
            "message":"User demoted successfully."
        });
    } catch(err){
        res.status(500).send({
            "message":"Error demoting user.",
            "error": err
        });
    }
};

const getSingleUserInfo = async (req, res) => {
    const {username} = req.body;
    let userid = req.decoded.userId;
    let admin = await User.findById(req.decoded.userId);
    if(!admin || admin.role != "admin"){
        return res.status(400).send({
            "message":"You are not authorized to perform this action."
        });
    }
    const dbuserid = await User.findOne({username: username});
    if(!dbuserid){
        return res.status(400).send({
            "message":"User does not exist."
        });
    }
    try{
        res.status(200).send({
            "message":"User found.",
            "user": dbuserid
        });
    } catch(err){
        res.status(500).send({
            "message":"Error getting user info.",
            "error": err
        });
    }
};




    
module.exports = {
    removeUser,
    removePoll,
    promoteUser,
    demoteUser,
    getSingleUserInfo
};

    
    






