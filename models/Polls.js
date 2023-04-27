const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled Poll',
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
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    endedAt: {
        type: Date,
        default: null,
    },
    isprivate: {
        type: Boolean,
        default: false,
    }
    

});

const Poll = mongoose.model('Poll',pollSchema);

module.exports = Poll;



