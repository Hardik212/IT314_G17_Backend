const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // array of questions _ids
    questions: [
        {
            type:mongoose.Schema.ObjectId,
            ref:'Question',
            required:true
        }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

});

const Poll = mongoose.model('Poll',pollSchema);

module.exports = Poll;



