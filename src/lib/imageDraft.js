const { ImageDraft } = require('../model/index');

/** CRUD OPERATIONS ON IMAGES */

/**
 * CREATE
 * 
 * @param {*} imageObj 
 */
const createImageDraft = async (imageDraftObj) => {
    const imageDraft = new ImageDraft(imageDraftObj);
    await imageDraft.save();
    return imageDraft;
};

/**
 * READ all entries
 */
const getAllImageDrafts = async () => {
    const imageDrafts = await ImageDraft.find();
    return imageDrafts;
}

/**
 * READ one image entry
 * @param {*} queryObject 
 */
const getImageDraft = async (queryObject) => {
    const imageDraft = await ImageDraft.findOne(queryObject);
    return imageDraft;
};

/**
 * READ all image draft entry
 * @param {*} queryObject 
 */
const getImageDrafts = async (queryObject) => {
    const imageDrafts = await ImageDraft.find(queryObject);
    return imageDrafts;
};

/**
 * DELETE one image entries
 */
const deleteImageDraft = async (queryObject) => {
    await ImageDraft.deleteOne(queryObject);
};

module.exports = { createImageDraft, getImageDrafts, getImageDraft, deleteImageDraft, getAllImageDrafts }