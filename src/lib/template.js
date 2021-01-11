const { Template } = require('../model/index');

/** CRUD OPERATIONS ON TEMPLATES */

/**
 * CREATE
 * 
 * @param {*} templateObj 
 */
const createTemplate = async (templateObj) => {
    const newTemplate = Template(templateObj);
    await newTemplate.save();
    return newTemplate;
};

/**
 * READ all template entries
 */
const getTemplates = async () => {
    const templates = await Template.find({});
    return templates;
};

/**
 * READ one template entry
 * @param {*} queryObject 
 */
const getTemplate = async (queryObject) => {
    const template = await Template.findOne(queryObject);
    if (!template) { return -1; } // error code -1 is returned for no template found
    return template;
};

/**
 * DELETE all template entries
 */
const deleteTemplates = async () => {
    const result = await Template.deleteMany({});
    return result;
};

/**
 * DELETE one template entries
 */
const deleteTemplate = async (queryObject) => {
    await Template.deleteOne(queryObject);
};

module.exports = { createTemplate, getTemplates, getTemplate, deleteTemplate, deleteTemplates }