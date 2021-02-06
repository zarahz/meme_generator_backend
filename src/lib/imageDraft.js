const { ImageDraft, Caption } = require('../model/index');

/** CRUD OPERATIONS ON IMAGES */

/**
 * CREATE
 * 
 * @param {*} imageObj 
 */
const createImageDraft = async (imageDraftObj) => {
    const imageDraft = new ImageDraft({
        title: imageDraftObj.title,
        memeSource: imageDraftObj.memeSource,
        userId: imageDraftObj.userId,
        creationDate: imageDraftObj.creationDate
    });
    await imageDraft.save(function (err) {
        if (err) return null;
        imageDraftObj.captions.forEach(async caption => {
            delete caption._id;
            caption.meme = imageDraft.id;
            const dbCaption = new Caption(caption);
            await dbCaption.save();
        });
    });
    return imageDraft;
};

/**
 * READ all entries
 */
const getAllImageDrafts = async () => {
    const imageDrafts = await ImageDraft.find().populate('captions');
    return imageDrafts;
}

/**
 * READ one image entry
 * @param {*} queryObject 
 */
const getImageDraft = async (queryObject) => {
    const imageDraft = await ImageDraft.findOne(queryObject).populate('captions');
    return imageDraft;
};

/**
 * READ all image draft entry
 * @param {*} queryObject 
 */
const getImageDrafts = async (queryObject) => {
    const imageDrafts = await ImageDraft.find(queryObject).populate('captions')
    return imageDrafts;
};

/**
 * DELETE image entries
 */
const deleteImageDrafts = async (queryObject) => {
    await ImageDraft.deleteMany(queryObject);
};

module.exports = { createImageDraft, getImageDrafts, getImageDraft, deleteImageDrafts, getAllImageDrafts }