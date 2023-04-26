
const mongoose = require('mongoose');

const PromotedSchema = new mongoose.Schema({
    pollid: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Poll',
        required:true,
        unique:true
    },
});


const Promoted = mongoose.model('Promoted',PromotedSchema);

module.exports = Promoted;