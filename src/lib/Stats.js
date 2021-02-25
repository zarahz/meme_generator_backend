const { TemplateStats, MemeStats } = require('../model/index');
const { getImage } = require('./image');

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
            return TemplateStats.findOneAndUpdate({ url: meme.template }, { $push: { viewedAfterCreation: new Date() } }, { new: true }).exec()
        }
    }));
};

/**
 * UPDATE generated stats
 * 
 * @param {*} url 
 */
const updateTemplateStatisticGenerated = async (url) => {
    const dbTemplateStats = await TemplateStats.findOneAndUpdate({ url }, { $push: { generated: new Date() } }, { new: true })

    await dbTemplateStats.save();
    return dbTemplateStats;
};

/**
 * UPDATE upvoted stats
 * 
 * @param {*} url 
 */
const updateTemplateStatisticUpvoted = async (memeId) => {
    const meme = await getImage({ '_id': memeId });
    if (meme) {
        const dbTemplateStats = await TemplateStats.findOneAndUpdate({ url: meme.template }, { $inc: { upvoted: 1 } }, { new: true })

        await dbTemplateStats.save();
        return dbTemplateStats;
    }
};

/**
 * UPDATE downvoted stats
 * 
 * @param {*} url 
 */
const updateTemplateStatisticDownvoted = async (memeId) => {
    const meme = await getImage({ '_id': memeId });
    if (meme) {
        const dbTemplateStats = await TemplateStats.findOneAndUpdate({ url: meme.template }, { $inc: { downvoted: 1 } }, { new: true })

        await dbTemplateStats.save();
        return dbTemplateStats;
    }
};

/**
 * CREATE/UPDATE multiple viewed stats
 * 
 * @param {*} templateObj 
 */
const createOrUpdateMultipleTemplateStatisticViewed = async (templates) => {
    return Promise.all(templates.map(template => {
       
         return TemplateStats.findOneAndUpdate({ url: template.url }, { $inc: { viewed: 1 } }, { new: true, upsert: true }).exec()

     
    }
   ));
};

/**
 * READ all template entries
 */
const getTemplateStatistics = async () => {
    const templates = await TemplateStats.find({});
    return templates;
};
const deleteAllTemplateStatistics = async () => {
    await TemplateStats.deleteMany({});
}

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
        MemeStats.findOneAndUpdate({ memeId: meme._id }, { $push: { viewed: new Date() } }, { new: true, upsert: true }).exec())
    );
};

const deleteAllMemeStatistics = async () => {
    await MemeStats.deleteMany({});
}

module.exports = {
    createOrUpdateMultipleTemplateStatisticViewed,
    updateTemplateStatisticChosen,
    updateTemplateStatisticGenerated,
    updateTemplateStatisticUpvoted,
    updateTemplateStatisticDownvoted,
    updateTemplateStatisticViewedAfterCreation,
    getTemplateStatistics,
    createOrUpdateMultipleMemeStatisticViewed,
    deleteAllMemeStatistics,
    getMemeStatistics,
    deleteAllTemplateStatistics
}