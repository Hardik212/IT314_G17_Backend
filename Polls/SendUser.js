const Poll = require("../models/Polls");
const Question = require("../models/Question");
const User = require("../models/User");

const SendpolltoUser = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(401).send({
      message: "Redirect to homepage",
    });
  }

  // check if id poll is exist or not
  let ispollexist;
  try {
    ispollexist = await Poll.findOne({
      _id: id,
    });
  } catch (err) {
    return res.status(401).send({
      error: "internal server error",
      "error-message": err,
    });
  }

  if (!ispollexist) {
    return res.status(401).send({
      error: "poll not exist",
    });
  }

  /* is poll private or not */
  if(ispollexist.isprivate && req.body.currentUser == ""){
    return res.status(403).send({
      error: "poll is private,Need to login.",
    });
  }
  if(ispollexist.isprivate){
  const currentUser = req.body.currentUser;
  const pollcreatorUser = ispollexist.creator;
  let pollcreatorUserobj;
  try{
    pollcreatorUserobj = await User.findById(pollcreatorUser);
  }catch(err){
    return res.status(401).send({
      error: "internal server error",
      "error-message": err,
    });
  }

  for(let i = 0;i<pollcreatorUserobj.followers.length;i++){
    if(pollcreatorUserobj.followers[i] == currentUser){
      break;
    }
    if(i == pollcreatorUserobj.followers.length-1 && req.body.currentUser != pollcreatorUser){      // added for allowing creator to see result
      return res.status(403).send({
        error: "poll is private",
      });
    }
  }
}





  if(ispollexist.endedAt < Date.now()){
    return res.status(406).send({
      error: "poll is ended",
    });
  }

  // make the poll object and return
  let pollobj = {};

  pollobj.title = ispollexist.title;
  pollobj.description = ispollexist.description;
  pollobj.questions = [];
  pollobj.creator = ispollexist.creator;  // added for private result access

  for (let i = 0; i < ispollexist.questions.length; i++) {
    const qid = ispollexist.questions[i];
    const question = await Question.findById(qid);
    if (!question) {
      return res.status(401).send({
        error: "Internal Error while fetching the question",
      });
    }

    let questionobj = {};

    questionobj.questionid = question._id;
    questionobj.question = question.question;
    questionobj.type = question.type;
    questionobj.options = question.options;
    questionobj.count = question.count;

    pollobj.questions.push(questionobj);
  }

  // const userprof = await User.findById(ispollexist.creator);
  // pollobj.creator = userprof.name;

  res.status(200).send({
    message: "poll successfully fetched",
    pollobject: pollobj,
  });
};

module.exports = SendpolltoUser;
