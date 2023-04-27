const Poll = require("../models/Polls");
const Response = require("../models/Response");
const Question = require("../models/Question");
const User = require("../models/User");

const TakeUserResponse = async (req, res) => {
   const {pollid,userid,responses} = req.body;
    if(!pollid){
        return res.status(401).send({
            "message":"pollid is required",
        })
    }
    if(!responses){
        return res.status(401).send({
            "message":"responses is required",
        })
    }

    // check if id poll is exist or not
    let ispollexist;
    try{
        ispollexist = await Poll.findById(pollid);
    }catch(err){
        return res.status(401).send({
          error: "internal server error",
          "error-message": err,
        });
    }


    if(!ispollexist){
        return res.status(401).send({
            "message":"poll not found",
        })
    }

    //increase the poll response count
    await Poll.findByIdAndUpdate(ispollexist._id, {$inc: {responses: 1}});


    // check if the user is a valid user and increase its polls answered
    let respondinguser;
    if(userid){
        try{
            respondinguser = await User.findById(userid);
        }catch(err){
            return res.status(401).send({
            error: "internal server error",
            "error-message": err,
            });
        }
    }
    console.log(userid);
    console.log(respondinguser);
    if(respondinguser){
        console.log("hi");
        await User.findByIdAndUpdate(respondinguser._id, {$inc: {pollsanswered: 1}});
    }

    let schemaresponse;
    try{
        schemaresponse = await Response.findOne({"pollid":ispollexist._id});
    }catch(err){
        return res.status(401).send({
            "message":"internal server error",
            "error":err,
        })
    }
    if(!schemaresponse.answers){
        return res.status(401).send({
            "message":"Harsh Error",
        })
    }

    let userresponse = [];
    for(let i=0;i<responses.length;i++){
        if(responses[i].questionresponse.length == 0  || responses[i].questionresponse == ""){
            return res.status(401).send({
                "message":"please respond to all questions",
            })
        }
        else if(responses[i].questionid == schemaresponse.answers[i].questionid){
            userresponse.push(responses[i].questionresponse);
            await Response.findOneAndUpdate({
              "pollid":pollid,
              "answers.questionid":responses[i].questionid,
            },{
              $push:{
                "answers.$.questionresponse":responses[i].questionresponse,
              }
            },{
              upsert:true,
              multi:true
            })
        }

    }

    
    // push the userresponse to the database
    try{
        const savedresponse = await Response.findOneAndUpdate({
            "pollid":pollid,
        },{
            $push:{
                "responses":userresponse,
            }
        });
    }catch(err){
        return res.status(401).send({
            "message":"internal server error",
            "error":err,
        })
    }

    return res.status(200).send({
        "message":"response saved successfully!",
        "userresponse":userresponse,
    });  
};

module.exports = {TakeUserResponse};
