const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    pollid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Polls',
        required:true,
    },
    userid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    answers: [
        {
            questionid: {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Question',
                required:true,
            },
            questionresponse : [
                {
                    type:String,
                    
                }
            ]

        }
    ]
});

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;