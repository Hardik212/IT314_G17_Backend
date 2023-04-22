const Poll = require('../models/Polls');
const User = require('../models/User');
const Response = require('../models/Response');
const Question = require('../models/Question');

const GetAllPollsByUser = async (req, res) => {

    const {username} = req.body;
    // get userid   
    const userid = await User.findOne({username:username});
    if(!userid){
        return res.status(401).send({
            "message":"user not found",
        })
    }

    // get all polls by userid
    const polls = await Poll.find({creator:userid._id});
    if(!polls){
        return res.status(401).send({
            "message":"no polls found",
        })
    }
    
    return res.status(200).send({
        "message":"polls found",
        "polls":polls
    });
}

const getDetailsAboutPoll = async (req, res) => {
    const {pollid} = req.body;
    if(!pollid){
        return res.status(401).send({
            "message":"pollid is required",
        })
    }

    const pollanalysisobj = [];
    const pollresponse = await Response.findOne({pollid:pollid});
    if(!pollresponse){
        return res.status(401).send({
            "message":"no response found",
        })
    }

    for(let i=0;i<pollresponse.answers.length;i++){
        const questionid = pollresponse.answers[i].questionid;
        const questionresponse = pollresponse.answers[i].questionresponse;
        const question = await Question.findOne({_id:questionid});
        const questionobj = {
            "questionid":questionid,
        }
        if(question.type === '1'){
            // count the frequency of each option
            const optionsfrequency = {};
            for(let j=0;j<questionresponse.length;j++){
                if(optionsfrequency[questionresponse[j]]){
                    optionsfrequency[questionresponse[j]]++;
                }else{
                    optionsfrequency[questionresponse[j]] = 1;
                }
            }
            questionobj.optionsfrequency = optionsfrequency;
            questionobj.question = question;

        }else if(question.type === '2'){
            questionobj.question = question;
            questionobj.optionsfrequency = questionresponse;
        }    
        pollanalysisobj.push(questionobj);
    }
    pollanalysisobj.push({responses:pollresponse.responses});
    return res.status(200).send({
        "message":"poll analysis found",
        "pollanalysisobj":pollanalysisobj,

    });
}

module.exports={
    GetAllPollsByUser,
    getDetailsAboutPoll
}