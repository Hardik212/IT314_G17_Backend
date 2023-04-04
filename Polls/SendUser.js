const Poll = require('../models/Polls');
const Question = require('../models/Question')
const User = require('../models/User')

const SendpolltoUser = async (req,res)=>{
    const id = req.params.id;

    if(!id){
        res.redirect('landing.html');
        return res.status(401).send({
            "message":"Redirect to homepage"
        })
    }

    // check if id poll is exist or not
    let ispollexist;
    try{
        ispollexist = await Poll.findOne({
            "_id":id,
        });
    }catch(err){
        return res.status(401).send({
            "error":"internal server error",
            "error-message":err
        })
    }

    if(!ispollexist){
        return res.status(401).send({
            "error":"poll not exist",
        })
    }

    // make the poll object and return
    let pollobj = {};

    pollobj.title = ispollexist.title;
    pollobj.desription = ispollexist.description;
    pollobj.questions = [];

    for(let i = 0;i<ispollexist.questions.length;i++){
        const qid = ispollexist.questions[i];
        const question = await Question.findById(qid);
        if(!question){
            return res.status(401).send({
                "error":"Internal Error while fetching the question",
            })
        }


        let questionobj = {};
        questionobj.question = question.question;
        questionobj.type = question.type;
        questionobj.options = question.options;

        pollobj.questions.push(questionobj);
    }

    // const userprof = await User.findById(ispollexist.creator);
    // pollobj.creator = userprof.name;

    res.status(200).send({
        "message":"poll successfully fetched",
        "pollobject":pollobj,
    });
}

module.exports = SendpolltoUser;