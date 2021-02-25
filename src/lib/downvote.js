const { Downvote } = require('../model/index');
const { Upvote } = require('../model/index');
const { v4: uuid } = require('uuid');

/** CRUD OPERATIONS ON Downvote 

/**
 * CREATE
 * 
 * @param {*} downvoteObj 
 */
const createDownvote = async (downvoteObj) => {
     await Upvote.deleteOne({ authorId: downvoteObj.authorId, imageId: downvoteObj.imageId })
    const downvote = await Downvote.findOneAndDelete({ authorId: downvoteObj.authorId, imageId: downvoteObj.imageId })
    if (downvote) {
        return downvote
    }


    const newDownvote = new Downvote(downvoteObj);
    newDownvote.creationDate = new Date()
    newDownvote.id = uuid();
    await newDownvote.save();
    return newDownvote;
};


/**
 * READ downvote for specific userId or specific imageId
 * @param {*} queryObject 
 */
const getDownvotes = async (queryObject) => {
    const downvote = await Downvote.find(queryObject);
    if (!downvote) { return -1; } // error code -1 is returned for no downvotes found
    return downvote;
};



/**
 * DELETE downvote
 */
const deleteDownvote = async (queryObject) => {
    await Downvote.deleteOne(queryObject);
};

module.exports = { createDownvote, getDownvotes, deleteDownvote }

