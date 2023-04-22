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

    const schemaresponse = await Response.findOne({pollid:pollid});

    // save user to database
    // update the count in the database response by the given response
    for(let i=0;i<responses.length;i++){
        if(responses[i].questionresponse.length===0){
            return res.status(401).send({
                "message":"please select atleast one option",
            })
        }
        else if(responses[i].questionid == schemaresponse.answers[i].questionid){
            await Response.findOneAndUpdate({
              "pollid":pollid,
              "answers.questionid":responses[i].questionid,
            },{
              $push:{
                "answers.$.questionresponse":responses[i].questionresponse
              }
            },{
              upsert:true,
              multi:true
            })
        }

    }

    return res.status(200).send({
        "message":"response saved successfully!",
    });  
};



module.exports = {TakeUserResponse};
