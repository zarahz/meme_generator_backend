const { Schema, model } = require('mongoose');

const Downvote = new Schema({
    authorId: { type: String, required: true }, 
    imageId: { type: String, required: true },
    creationDate: { type: Date }
}); //required: true // trim: true


module.exports = model('downvote', Downvote);