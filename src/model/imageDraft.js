const { Schema, model } = require('mongoose');

const ImageDraft = new Schema({
    title: { type: String },
    // captions: [{ type: Schema.Types.ObjectId, ref: 'caption' }],
    memeSource: { type: String },
    userId: { type: String, required: true },
    creationDate: { type: Date },
}, { toJSON: { virtuals: true } })

ImageDraft.virtual('captions', {
    ref: 'caption',
    localField: '_id',
    foreignField: 'meme',
    justOne: false,
})

module.exports = model('imageDraft', ImageDraft);