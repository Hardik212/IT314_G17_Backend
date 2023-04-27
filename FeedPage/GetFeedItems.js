// get first 10 Polls and send response

const Poll = require('../models/Polls');
const User = require('../models/User');
const Question = require('../models/Question');
const Response = require('../models/Response');

const getFeedItems = async (req, res) => {
    // fetch num*10 polls
    let polls = await Poll.find().sort({createdAt: -1});
    if(polls == undefined || polls == null || polls.length == 0){
        return res.status(404).json({
            "error": "No polls found",
        });
    } 

    var feedItems = [];
    try{
        for (var i = 0; i < polls.length; i++) {
            var poll = polls[i];
            if(poll == null || poll == undefined){
                continue;
            }
            var feedItem = {};
            let userinfo = await User.findById(poll.creator);
            feedItem.creatorname = userinfo.name;
            feedItem.username = userinfo.username;
            feedItem.profilepic = userinfo.profilepic;
            feedItem.pollId = poll._id;
            feedItem.pollTitle = poll.title;
            feedItem.pollDescription = poll.description;
            feedItem.createdAt = poll.createdAt;
            feedItem.endedAt = poll.endedAt;
            if(poll.questions.length == 1){
                feedItem.questionType = "single";
                let question = await Question.findById(poll.questions[0]);
                feedItem.question = question.question;
                feedItem.questiontype = question.type;
                feedItem.options = question.options;
            }
            else{
                feedItem.questionType = "multiple";
            }
            feedItem.totalquestions = poll.questions.length;
            let responses;
            try{
                responses = await Response.findById(poll._id);
            }catch(err){
                console.log(err);
                return res.status(500).json({
                    "message": "error in fetching responses",
                    "error": err,
                })
            }

            if(responses == undefined || responses == null || responses.length == 0){
                feedItem.totalresponses = 0;
                feedItems.push(feedItem);
                continue;
            }
            feedItem.totalresponses = responses.answers[i].questionresponse.length;
            feedItems.push(feedItem);
        
        }

        res.status(200).json({
            "message": "fetched next 10 polls",
            "feedItems": feedItems,
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            "message": "error in fetching next 10 polls",
            "error": err,
        })
    }
};

module.exports = getFeedItems;