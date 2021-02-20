const { TemplateStats, MemeStats } = require('../model/index');

/** CRUD OPERATIONS ON TEMPLATES */

/**
 * UPDATE chosen stats
 * 
 * @param {*} url 
 */
const updateTemplateStatisticChosen = async (url) => {
    const dbTemplateStats = await TemplateStats.findOneAndUpdate({ url }, { $inc: { chosen: 1 } }, { new: true })

    await dbTemplateStats.save();
    return dbTemplateStats;
};

/**
 * UPDATE viewedAfterCreation stats
 * 
 * @param {*} url 
 */
const updateTemplateStatisticViewedAfterCreation = async (memes) => {
    return Promise.all(memes.map(meme => {
        if (meme.template) {
            return TemplateStats.findOneAndUpdate({ url: meme.template }, { $inc: { viewedAfterCreation: 1 } }, { new: true }).exec()
        }
    }));
};

/**
 * UPDATE generated stats
 * 
 * @param {*} url 
 */
const updateTemplateStatisticGenerated = async (url) => {
    const dbTemplateStats = await TemplateStats.findOneAndUpdate({ url }, { $inc: { generated: 1 } }, { new: true })

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


/** --------- MEME STASTS ------------- */
/**
 * READ all meme entries
 */
const getMemeStatistics = async () => {
    const memes = await MemeStats.find({});
    return memes;
};

/**
 * CREATE/UPDATE multiple viewed stats
 * 
 * @param {*} memeObj 
 */
const createOrUpdateMultipleMemeStatisticViewed = async (memes) => {
    return Promise.all(memes.map(meme =>
        MemeStats.findOneAndUpdate({ memeId: meme._id }, { $inc: { viewed: 1 } }, { new: true, upsert: true }).exec())
    );
};

const deleteAllMemeStatistics = async () => {
    await MemeStats.deleteMany({});
}

module.exports = {
    createOrUpdateMultipleTemplateStatisticViewed,
    updateTemplateStatisticChosen,
    updateTemplateStatisticGenerated,
    updateTemplateStatisticViewedAfterCreation,
    getTemplateStatistics,
    createOrUpdateMultipleMemeStatisticViewed,
    deleteAllMemeStatistics,
    getMemeStatistics
}