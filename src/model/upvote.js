const { Schema, model } = require('mongoose');

const Upvote = new Schema({
    authorId: { type: String, required: true }, // TODO add required: true here too
    imageId: { type: String, required: true },
    creationDate: { type: Date }
}); //required: true // trim: true


module.exports = model('upvote', Upvote);