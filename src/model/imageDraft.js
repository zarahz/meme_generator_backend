const { Schema, model } = require('mongoose');

const ImageDraft = new Schema({
    title: { type: String },
    topText: { type: String },
    topTextOffset: { type: [Number], 'default': [0, 30] },
    bottomText: { type: String },
    bottomTextOffset: { type: [Number], 'default': [0, -30] },
    memeSource: { type: String },
    userId: { type: String, required: true, unique: true },
    creationDate: { type: Date },
})

module.exports = model('imageDraft', ImageDraft);