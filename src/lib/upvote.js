const { Upvote } = require('../model/index');
const { v4: uuid } = require('uuid');

/** CRUD OPERATIONS ON Upvote 

/**
 * CREATE
 * 
 * @param {*} upvoteObj 
 */
const createUpvote = async (upvoteObj) => {
    const newUpvote = new Upvote(upvoteObj);
    
    newUpvote.id = uuid();
    await newUpvote.save();
    return newUpvote;
};


/**
 * READ upvotes for specific userId or specific imageId
 * @param {*} queryObject 
 */
const getUpvotes = async (queryObject) => {
    const upvote = await Upvote.find(queryObject);
    if (!upvote) { return -1; } // error code -1 is returned for no comment found
    return upvote;
};



/**
 * DELETE upvote
 */
const deleteUpvote = async (queryObject) => {
    await Upvote.deleteOne(queryObject);
};

module.exports = { createUpvote, getUpvotes, deleteUpvote }

