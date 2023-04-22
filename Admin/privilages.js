const User = require('../models/User');
const Poll = require('../models/Polls');
const Question = require('../models/Question');
dotenv = require('dotenv').config();


// // make function to get all users
// const getAllUsers = async (req, res) => {
    
//     // check if the admin is a valid user and is an admin
//     let admin = await User.findById(req.decoded.userId);
//     if(!admin || admin.role != "admin"){
//         return res.status(400).send({
//             "message":"You are not authorized to perform this action."
//         });
//     }

//     try {
//         const allUsers = await User.find();
//         res.status(200).send({
//             "message":"All users fetched successfully.",
//             "data": allUsers
//         });
//     } catch(err){
//         res.status(500).send({
//             "message":"Error fetching all users.",
//             "error": err
//         });
//     }

// };

// // make function to get all polls
// const getAllPolls = async (req, res) => {

//     // check if the admin is a valid user and is an admin
//     let admin = await User.findById(req.decoded.userId);
//     if(!admin || admin.role != "admin"){
//         return res.status(400).send({
//             "message":"You are not authorized to perform this action."
//         });
//     }
    
//     try {
//         const allPolls = await Poll.find();
//         res.status(200).send({
//             "message":"All polls fetched successfully.",
//             "data": allPolls
//         });
//     } catch(err){
//         res.status(500).send({
//             "message":"Error fetching all polls.",
//             "error": err
//         });
//     }
// };


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

    // // udelete from the follower list
    // for(let i=0;i<removinguser.followers.length;i++){
    //     const faltufollwer = await User.findOne({
    //         _id:removinguser.followers[i]
    //     });
    //     if(faltufollwer){
    //         await User.findOneAndUpdate({
    //             _id:faltufollwer._id
    //         },{
    //             $pop:{
    //                 "following":removinguser._id
    //             }
    //         },{
    //             upsert:true,
    //             multi:true
    //         })
    //      }
    // }

    // // delete removing user follwing list
    // console.log(removinguser.following.length);
    // for(let i=0;i<removinguser.following.length;i++){   
    //     const faltufollwing = await User.findOne({
    //         _id:removinguser.following[i]
    //     });
    //     if(faltufollwing){
    //         await User.findOneAndUpdate({
    //             _id:faltufollwing._id
    //         },{
    //             $pop:{
    //                 "follower":removinguser._id
    //             }
    //         },{
    //             upsert:true,
    //             multi:true
    //         })
    //     }
    // }

    
    
    


    // // if the poll is already deleted then remove from the user's pollscreated array
    // for(let i=0; i<removinguser.pollscreated.length; i++){
    //     try{
    //         const poll = await Poll.findById(removinguser.pollscreated[i]);
    //         if(!poll){
        //             await User.findByIdAndUpdate(removinguser._id, {$pull: {pollscreated: removinguser.pollscreated[i]}});
    //         }




    // find all the poll objects of the user
    // let userpolls = []; 
    
    // for(let i=0; i<removinguser.pollscreated.length; i++){

    //     const poll = await Poll.findById(removinguser.pollscreated[i]);
    //     if(!poll){
    //         // remove the poll id from the user's pollscreated array

    //     }else{
    //         try{
    //             userpolls.push(poll);
    //         } catch(err){
    //             res.status(500).send({
    //                 "message":"Error removing user polls.",
    //                 "error": err
    //             });
    //         }
    //     }
    // }

    // // remove all the questions of the polls
    // console.log(userpolls);
    // console.log(userpolls.length);
    // console.log("lalo");
    // for(let i=0; i<userpolls.length; i++){
    //     for(let j=0;j<userpolls[i].questions.length; j++){
//         try{
    //             await Question.findByIdAndDelete(userpolls[i].questions[j]);
    //         } catch(err){
        //             res.status(500).send({
            //                 "message":"Error removing user poll questions.",
            //                 "error": err 
            //             });
            //         }
            //     }
            // }
            
    // remove all the polls of the user
    // for(let i=0; i<userpolls.length; i++){
    //     try{
    //         await Poll.findByIdAndDelete(userpolls[i]._id);
    //     } catch(err){
    //         res.status(500).send({
    //                 "message":"Error removing user polls.",
    //                 "error": err
    //             });
    //         }
    //     }
            
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
        await PromotedPoll.findOneAndDelete({
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



module.exports = {
    // getAllUsers,
    // getAllPolls,
    removeUser,
    removePoll
};

    
    






