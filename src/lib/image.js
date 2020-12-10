const { Image } = require('../model/index');

/** CRUD OPERATIONS ON IMAGES */

/**
 * CREATE
 * 
 * @param {*} imageObj 
 */
const createImage = async (imageObj) => {
    const newImage = new Image(imageObj);
    await newImage.save();
    return newImage;
};

/**
 * READ all image entries
 */
const getImages = async () => {
    const images = await Image.find({});
    return images;
};

/**
 * READ one image entry
 * @param {*} queryObject 
 */
const getImage = async (queryObject) => {
    const image = await Image.findOne(queryObject);
    if (!image) { return -1; } // error code -1 is returned for no image found
    return image;
};

/**
 * DELETE all image entries
 */
const deleteImages = async () => {
    const result = await Image.deleteMany({});
    return result;
};

/**
 * DELETE one image entries
 */
const deleteImage = async (queryObject) => {
    await Image.deleteOne(queryObject);
};

module.exports = { createImage, getImages, getImage, deleteImage, deleteImages }