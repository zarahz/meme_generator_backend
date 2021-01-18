const { ImageDraft } = require('../model/index');

/** CRUD OPERATIONS ON IMAGES */

/**
 * CREATE
 * 
 * @param {*} imageObj 
 */
const createOrUpdateImageDraft = async (imageDraftObj) => {
    const imageDraft = await ImageDraft.updateOne({ userId: imageDraftObj.userId }, imageDraftObj, { upsert: true, new: true });
    return imageDraft;
    // const newImage = new Image(imageObj);
    // await newImage.save();
    // return newImage;
};

/**
 * READ all entries
 */
const getAllImageDrafts = async () => {
    const imageDrafts = await ImageDraft.find({});
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
 * DELETE one image entries
 */
const deleteImageDraft = async (queryObject) => {
    await ImageDraft.deleteOne(queryObject);
};

module.exports = { createOrUpdateImageDraft, getImageDraft, deleteImageDraft, getAllImageDrafts }