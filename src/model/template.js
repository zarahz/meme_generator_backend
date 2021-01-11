const { Schema, model } = require('mongoose');

const Template = new Schema({
    name: { type: String },
    fileType: { type: String },
    nameAndFileType: { type: String },
    path: { type: String, required: true }
}); //required: true // trim: true

module.exports = model('template', Template);