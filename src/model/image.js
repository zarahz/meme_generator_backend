const { Schema, model } = require('mongoose');

const Image = new Schema({
    name: { type: String }, //this is the fileName not the title!
    fileType: { type: String },
    nameAndFileType: { type: String },
    template: { type: String },
    createdBy: { type: String },
    creationDate: { type: Date },
    path: { type: String, required: true },
    visibility: { type: String, default: 'public' },
    title: { type: String }
}); //required: true // trim: true

module.exports = model('image', Image);