const Image = require('./image');
const ImageDraft = require('./imageDraft');
const User = require('./user');
const Comment = require('./comment');
const Upvote = require('./upvote');
const Downvote = require('./downvote');
const Template = require('./template');
const { MemeStats, TemplateStats } = require('./stats');
const Caption = require('./caption');


module.exports = {
    Caption,
    Image,
    ImageDraft,
    User,
    Comment,
    Upvote,
    Downvote,
    Template,
    TemplateStats,
    MemeStats
};