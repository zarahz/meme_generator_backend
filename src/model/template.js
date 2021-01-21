const { Schema, model } = require('mongoose');

const Template = new Schema({
    fileName: { type: String }, // without extension
    tags: { type: String },
    url: { type: String },
    fileType: { type: String }, // with dot and extension e.g. ".jpg"
    nameAndFileType: { type: String },
    path: { type: String, required: true },
    isWebScreenshot: { type: Boolean, required: true },
}); //required: true // trim: true

module.exports = model('template', Template);