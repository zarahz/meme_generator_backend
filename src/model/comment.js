const { Schema, model } = require('mongoose');

const Comment = new Schema({
    authorId: { type: String }, // TODO add required: true here too
    imageId: { type: String, required: true },
    content: { type: String, required: true, trim: true },
    creationDate: { type: Date }
}); //required: true // trim: true


module.exports = model('comment', Comment);