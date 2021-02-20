const { TemplateStats, MemeStats } = require('../model/index');

/** CRUD OPERATIONS ON TEMPLATES */

/**
 * CREATE
 * 
 * @param {*} templateObj 
 */
const createOrUpdateTemplateStatistic = async (templateStats) => {
    const url = templateStats.url;
    delete templateStats.url;

    const dbTemplateStats = await TemplateStats.findOneAndUpdate({ url: url }, { $inc: templateStats }, { new: true, upsert: true })

    await dbTemplateStats.save();
    return dbTemplateStats;
};

/**
 * CREATE/UPDATE chosen stats
 * 
 * @param {*} url 
 */
const updateTemplateStatisticChosen = async (url) => {
    const dbTemplateStats = await TemplateStats.findOneAndUpdate({ url }, { $inc: { chosen: 1 } }, { new: true, upsert: true })

    await dbTemplateStats.save();
    return dbTemplateStats;
};

/**
 * CREATE/UPDATE gereated stats
 * 
 * @param {*} url 
 */
const updateTemplateStatisticGenerated = async (url) => {
    const dbTemplateStats = await TemplateStats.findOneAndUpdate({ url }, { $inc: { generated: 1 } }, { new: true, upsert: true })

    await dbTemplateStats.save();
    return dbTemplateStats;
};

/**
 * CREATE/UPDATE multiple viewed stats
 * 
 * @param {*} templateObj 
 */
const createOrUpdateMultipleTemplateStatisticViewed = async (templates) => {
    return Promise.all(templates.map(template =>
        TemplateStats.findOneAndUpdate({ url: template.url }, { $inc: { viewed: 1 } }, { new: true, upsert: true }).exec())
    );
};

/**
 * READ all template entries
 */
const getTemplateStatistics = async () => {
    const templates = await TemplateStats.find({});
    return templates;
};

/**
 * READ one template entry
 * @param {*} queryObject 
 */
const getTemplateStatistic = async (queryObject) => {
    const template = await TemplateStats.findOne(queryObject);
    if (!template) { return -1; } // error code -1 is returned for no template found
    return template;
};

/**
 * READ multiple template entries
 * @param {*} queryObject 
 */
const getMultipleTemplateStatistics = async (queryObjects) => {
    //TODO 
    let templateStatistics = [];
    queryObjects.forEach(async template => {
        const statistic = await TemplateStats.findOne(template);
        (statistic) && templateStatistics.push(statistic);
    })

};

module.exports = {
    updateTemplateStatisticChosen,
    updateTemplateStatisticGenerated,
    createOrUpdateMultipleTemplateStatisticViewed,
    getTemplateStatistics,
    getTemplateStatistic,
    getMultipleTemplateStatistics
}