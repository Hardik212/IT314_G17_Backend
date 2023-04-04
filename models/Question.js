const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
    },
});

// make the model
const Question = mongoose.model('Question', questionSchema);

// export the model
module.exports = Question;
