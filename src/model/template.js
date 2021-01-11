const { Schema, model } = require('mongoose');

const Template = new Schema({
    fileName: { type: String },
    tags: { type: String },
    fileType: { type: String },
    nameAndFileType: { type: String },
    path: { type: String, required: true }
}); //required: true // trim: true

module.exports = model('template', Template);