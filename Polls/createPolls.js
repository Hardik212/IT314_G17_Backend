const Poll = require('../models/Polls');
const Question = require('../models/Question');
const User = require('../models/User');
const Response = require('../models/Response')

const createPolls = async (req, res) => {
    const { title, description, questions, userid, endedAt, isprivate} = req.body;
    console.log(req.body.endedAt);
    if(!title){
        return res.status(400).send({
            "message":"title is required",
        })
    }
    if(!description){
        return res.status(400).send({
            "message":"description is required",
        })
    }
    if(!questions){
        return res.status(400).send({
            "message":"questions are required",
        })
    }
    if(!endedAt){
        return res.status(400).send({
            "message":"Please provide the end date of the poll",
        })
    }

    if(endedAt < Date.now()){
        return res.status(400).send({
            "message":"Please provide a valid end date of the poll",
        })
    }

    if(questions.length === 0){
        return res.status(400).send({
            "message":"questions are required",
        })
    }
    questions.forEach((question) => {
        if(!question.question || question.question === ""){
            return res.status(400).send({
                "message":"question is required",
            })
        }
        if(!question.type || question.type === ""){
            return res.status(400).send({
                "message":"type is required",
            })
        }
        if(question.type === '1' && !question.options){
            return res.status(400).send({
                "message":"options are required",
            })
        }
    })

    if(!userid){
        return res.status(400).send({
            "message":"userid is required",
        })
    }
    // check if user is exist or not
    let isuserexist;
    try{
        isuserexist = await User.findOne({
            "_id":userid,
        });
    }catch(err){
        return res.status(401).send({
            "error":"User not exist",
            "error-message":err
        })
    }

    if(!isuserexist){
        return res.status(401).send({
            "error":"user not exist",
        })
    }

    // create questions
    let questionids = [];
    for(let i=0;i<questions.length;i++){
        let question;
        if(questions[i].type == "1"){

            question = new Question({
                "question":questions[i].question,
                "type":questions[i].type,
                "options":questions[i].options,
            });
        }else if(questions[i].type == "2"){
            question = new Question({
                "question":questions[i].question,
                "type":questions[i].type,
            });
        }
        try{
            await question.save();
        }catch(err){
            return res.status(401).send({
                "error":"internal server error first",
                "error-message":err
            })
        }
        questionids.push(question._id);

    }

    // create poll
    let poll = new Poll({
        "title":title,
        "description":description,
        "questions":questionids,
        "creator":userid,
        "endedAt":endedAt,
        "isprivate":isprivate
    });
    try{
        await poll.save();
        await User.findByIdAndUpdate(userid, {$push: {pollscreated: poll._id}});
    }catch(err){
        return res.status(401).send({
            "error":"internal server error second",
            "error-message":err
        })
    }

    // ek response khali banay
    questionidresponseobj = [];
    for(let i=0;i<questionids.length;i++){
        questionidresponseobj.push({
            "questionid":questionids[i],
            "questionresponse":[]
        })
    }
    let response = new Response({
        "pollid":poll._id,
        "answers":questionidresponseobj,
        "userresponse":[]
    });
    try{
        await response.save();
    }catch(err){
        return res.status(401).send({
            "error":"internal server error third",
            "error-message":err
        })  
    }

    return res.status(200).send({
        "message":"poll created successfully",
        "pollurl":`http://localhost:5500/poll.html?pollid=${poll._id}`,
        "poll":poll
    })


}

module.exports = createPolls;