const { Schema, model } = require('mongoose');

const Caption = Schema({
    text: { type: String },
    offsetX: { type: Number },
    offsetY: { type: Number },
    label: { type: String },
    deleteable: { type: Boolean, 'default': true },
    fromBottom: { type: Boolean, 'default': false },
    meme: { type: Schema.Types.ObjectId, ref: 'imageDraft' }
})

module.exports = model('caption', Caption);