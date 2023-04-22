const Promoted = require('../models/Promoted');
const Poll = require('../models/Polls');
const Response = require('../models/Response');

const getPromotedPolls = async (req, res) => {

    try {
        const promotedPolls = await Promoted.find();
        res.status(200).json({
            message: 'Promoted polls served',
            data: promotedPolls
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const updatePromotedPolls = async (req, res) => {
    const {pollid} = req.body;
    try {
        const ispollExist = await Poll.findById(pollid);
        if(!ispollExist) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        const promotedPolls = await Promoted.find();
        for(let i=0;i<promotedPolls.length;i++){
            if(promotedPolls[i].pollid == pollid){
                return res.status(400).json({ message: 'Poll already promoted' });
            }
        }
        try {
            const newpoll = new Promoted({pollid: pollid});
            await newpoll.save();
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }

        res.status(200).json({
            message: 'Poll added into promoted polls',
            data: promotedPolls
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
        
}

// remove promoted poll
const removePromotedPolls = async (req, res) => {
    const {pollid} = req.body;
    try {
        const ispollExist = await Poll.findById(pollid);
        if(!ispollExist) {
            return res.status(404).json({ message: 'Poll not found' });
        }
        const responsefromdb = await Poll.findOneAndDelete({pollid: pollid});
        return res.status(200).json({
            message: 'Poll removed from promoted polls',
            data: responsefromdb
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }

};


module.exports = {
    getPromotedPolls, 
    updatePromotedPolls,
    removePromotedPolls
};