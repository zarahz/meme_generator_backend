const { Comment } = require('../model/index');

/** CRUD OPERATIONS ON Comments 
CRUD = Create, Read, Update, Delete */

/**
 * CREATE
 * 
 * @param {*} commentObj 
 */
const createComment = async (commentObj) => {
    const newComment = new Comment(commentObj);
    newComment.creationDate = new Date()
    await newComment.save();
    return newComment;
};

/**
 * READ all comment entries
 */
const getComments = async () => {
    const comments = await Comment.find({});
    return comments;
};

/**
 * READ comments for specific userId
 * @param {*} queryObject 
 */
const getComment = async (queryObject) => {
    const comment = await Comment.find(queryObject);
    if (!comment) { return -1; } // error code -1 is returned for no comment found
    return comment;
};

/**
 * READ comments for specific imageId
 * @param {*} queryObject 
 */
const getCommentsFor = async (queryObject) => {
    const comment = await Comment.find(queryObject);
    if (!comment) { return -1; } // error code -1 is returned for no comment found
    return comment;
};

/**
 * DELETE all Comment entries
 */
const deleteComments = async () => {
    const result = await Comment.deleteMany({});
    return result;
};

/**
 * DELETE one comment entries
 */
const deleteComment = async (queryObject) => {
    await Comment.deleteOne(queryObject);
};

module.exports = { createComment, getComments, getCommentsFor, getComment, deleteComment, deleteComments }

