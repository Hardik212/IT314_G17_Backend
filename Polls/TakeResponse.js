const Poll = require("../models/Polls");
const Response = require("../models/Response");
const Question = require("../models/Question");
const User = require("../models/User");

const TakeUserResponse = async (req, res) => {
  const { pollid, userid, responses } = req.body;
  console.log(pollid, userid, responses);
  if (!pollid) {
    return res.status(401).send({
      message: "pollid is required",
    });
  }

  // check if id poll is exist or not
  let ispollexist;
  console.log("sdadasd");
  try {
    ispollexist = await Poll.findById(pollid);
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

  // check if user already responded or not
  let isuserresponded = false;
  if (userid) {
    try {
      isuserresponded = await Response.findOne({
        pollid: pollid,
        userid: userid,
      });
    } catch (err) {
      return res.status(401).send({
        error: "internal server error",
        "error-message": err,
      });
    }
  }

  if (isuserresponded) {
    return res.status(401).send({
      error: "user already responded",
    });
  }

  // check if all questions are answered or not
  let isallquestionsanswered = true;
  for (let j = 0; j < responses.length; j++) {
    // remove the starting and ending spaces
    if (responses[j].questionresponse) {
      for (let k = 0; k < responses[j].questionresponse.length; k++) {
        responses[j].questionresponse[k] =
          responses[j].questionresponse[k].trim();
      }
    }
    if (
      !responses[j].questionresponse ||
      responses[j].questionresponse.length == 0 ||
      responses[j].questionresponse == ""
    ) {
      isallquestionsanswered = false;
      break;
    } else {
      // if type is 1 then string consiste of numbers only
      let questiontype;
      try {
        const question = await Question.findOne({
          _id: responses[j].questionid,
        });
        questiontype = question.type;
      } catch (err) {
        return res.status(401).send({
          error: "internal server error",
          "error-message": err,
        });
      }
      if (questiontype == "1") {
        console.log("type 1");
        for (let k = 0; k < responses[j].questionresponse.length; k++) {
          if (isNaN(responses[j].questionresponse[k])) {
            isallquestionsanswered = false;
            break;
          }
        }
      }
    }
  }
  if (!isallquestionsanswered) {
    return res.status(401).send({
      error: "all questions are not answered",
    });
  }

  // save the response
  let response = new Response({
    pollid: pollid,
    userid: userid,
    answers: responses,
  });

  try {
    await response.save();
  } catch (err) {
    return res.status(401).send({
      error: "internal server error",
      "error-message": err,
    });
  }

  return res.status(200).send({
    message: "Your response saved successfully",
  });
};

module.exports = TakeUserResponse;
