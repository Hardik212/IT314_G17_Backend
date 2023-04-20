const Promoted = require('../models/Promoted');

const getPromotedPolls = async (req, res) => {

    try {
        const promotedPolls = await Promoted.find();
        res.status(200).json({
            message: 'Promoted Polls',
            data: promotedPolls
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const updatePromotedPolls = async (req, res) => {
    const { pollid } = req.body;
    // pop the least recent poll and push the new poll
    try {
        const promotedPolls = await Promoted.find();
        const promotedPollsArray = promotedPolls[0].pollid;
        promotedPollsArray.pop();
        promotedPollsArray.unshift(pollid);
        await Promoted.updateOne({ _id: promotedPolls[0]._id }, { pollid: promotedPollsArray });
        res.status(200).json({ message: 'Promoted Polls Updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }

}

module.exports = {
    getPromotedPolls, 
    updatePromotedPolls
};