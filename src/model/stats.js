const { Schema, model } = require('mongoose');

const TemplateStats = new Schema({
    url: { type: String, required: true, unique: true }, // the unique indicator here
    viewed: { type: Number, default: 0 },
    chosen: { type: Number, default: 0 },
    generated: { type: Number, default: 0 },
    viewedAfterCreation: { type: Number, default: 0 },
    upvoted: { type: Number, default: 0 },
    downvoted: { type: Number, default: 0 }
});

const MemeStats = new Schema({
    url: { type: String, required: true, unique: true }, // the unique indicator here
    viewed: { type: Number, default: 0 },
    upvoted: { type: Number, default: 0 },
    downvoted: { type: Number, default: 0 }
});

module.exports = {
    TemplateStats: model('templateStats', TemplateStats),
    MemeStats: model('memeStats', MemeStats)
};