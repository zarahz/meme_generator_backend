const { Schema, model } = require('mongoose');

const Image = new Schema({
    name: { type: String },
    fileType: { type: String },
    nameAndFileType: { type: String },
    createdBy: { type: String },
    creationDate: { type: Date },
    path: { type: String, required: true }
}); //required: true // trim: true

module.exports = model('image', Image);