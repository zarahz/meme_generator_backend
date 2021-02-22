const { Schema, model } = require('mongoose');

const TemplateStats = new Schema({
    url: { type: String, required: true, unique: true }, // the unique indicator here
    viewed: { type: Number, default: 0 },
    chosen: { type: Number, default: 0 },
    generated: { type: [Date] },
    viewedAfterCreation: { type: [Date] },
    upvoted: { type: Number, default: 0 },
    downvoted: { type: Number, default: 0 },
});

const MemeStats = new Schema({
    memeId: { type: String, required: true, unique: true }, // the unique indicator here
    viewed: { type: [Date] },
    //TODO up votes/views over time?
});

module.exports = {
    TemplateStats: model('templateStats', TemplateStats),
    MemeStats: model('memeStats', MemeStats)
};