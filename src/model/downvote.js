const { Schema, model } = require('mongoose');

const Downvote = new Schema({
    authorId: { type: String }, // TODO add required: true here too
    imageId: { type: String, required: true },
    creationDate: { type: Date }
}); //required: true // trim: true


module.exports = model('downvote', Downvote);