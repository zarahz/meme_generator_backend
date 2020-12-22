const { Downvote } = require('../model/index');
const { v4: uuid } = require('uuid');

/** CRUD OPERATIONS ON Downvote 

/**
 * CREATE
 * 
 * @param {*} downvoteObj 
 */
const createDownvote = async (downvoteObj) => {
    const newUpvote = new Upvote(downvoteObj);
    
    newUpvote.id = uuid();
    await newUpvote.save();
    return newUpvote;
};


/**
 * READ downvote for specific userId or specific imageId
 * @param {*} queryObject 
 */
const getDownvotes = async (queryObject) => {
    const downvote = await Downvote.find(queryObject);
    if (!downvote) { return -1; } // error code -1 is returned for no comment found
    return downvote;
};



/**
 * DELETE downvote
 */
const deleteDownvote = async (queryObject) => {
    await Downvote.deleteOne(queryObject);
};

module.exports = { createDownvote, getDownvotes, deleteDownvote }

