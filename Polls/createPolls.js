const Poll = require('../models/Polls');
const Question = require('../models/Question');
const User = require('../models/User');
const Response = require('../models/Response')

const createPolls = async (req, res) => {
    const { title, description, questions, userid } = req.body;
    if(!title){
        return res.status(401).send({
            "message":"title is required",
        })
    }
    if(!description){
        return res.status(401).send({
            "message":"description is required",
        })
    }
    if(!questions){
        return res.status(401).send({
            "message":"questions are required",
        })
    }
    if(!userid){
        return res.status(401).send({
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
    });
    try{
        await poll.save();
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
    console.log(response);
    console.log(poll._id);
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
        "pollurl":"http://localhost:3000/api/"+poll._id,
        "poll":poll
    })


}

module.exports = createPolls;