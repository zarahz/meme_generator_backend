const { Schema, model } = require('mongoose');

const Zipfile = new Schema({
    authorId: { type: String, required: true }, 
    link: { type: String, required: true },
    creationDate: { type: Date }
}); 
module.exports = model('zipfile', Zipfile);