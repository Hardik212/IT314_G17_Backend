const Poll = require("../models/Polls");
const Response = require("../models/Response");
const Question = require("../models/Question");
const User = require("../models/User");
const { update } = require("lodash");

const TakeUserResponse = async (req, res) => {
   const {pollid,userid,responses} = req.body;
    if(!pollid){
        return res.status(401).send({
            "message":"pollid is required",
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

    // check if the user is a valid user and increase its polls answered
    let respondinguser;
    try{
        respondinguser = await User.findById(userid);
    }catch(err){
        return res.status(401).send({
          error: "internal server error",
          "error-message": err,
        });
    }
    if(respondinguser){
        await User.findByIdAndUpdate(userid, {$inc: {pollsanswered: 1}});
    }


    const schemaresponse = await Response.findOne({pollid:pollid});

    // save user to database
    // update the count in the database response by the given response
    let userresponse = [];
    for(let i=0;i<responses.length;i++){
        if(responses[i].questionresponse.length===0){
            return res.status(401).send({
                "message":"please select atleast one option",
            })
        }
        else if(responses[i].questionid == schemaresponse.answers[i].questionid){
            console.log(responses[i].questionresponse)
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
        console.log(savedresponse);
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
