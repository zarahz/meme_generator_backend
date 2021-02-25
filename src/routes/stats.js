
const { Router } = require('express');
const {
    getTemplateStatistics,
    createOrUpdateMultipleTemplateStatisticViewed,
    updateTemplateStatisticChosen,
    updateTemplateStatisticViewedAfterCreation,
    createOrUpdateMultipleMemeStatisticViewed,
    deleteAllMemeStatistics,
    getMemeStatistics,
    deleteAllTemplateStatistics
} = require('../lib/Stats');

const router = Router();

router.get('/templates', async (req, res) => {
    const statistics = await getTemplateStatistics();
    if (statistics) {
        return res.status(200).send(statistics);
    }
    return res.status(500).send({ error: 'error' });
});

router.post('/templates/viewed', async (req, res) => {
    let templates = req.body;
    const statistics = await createOrUpdateMultipleTemplateStatisticViewed(templates);
    return res.status(200).send(statistics);
});

router.post('/templates/chosen', async (req, res) => {
    let template = req.body;
    const statistics = await updateTemplateStatisticChosen(template.url);
    return res.status(200).send(statistics);
});

router.post('/templates/viewed-after-creation', async (req, res) => {
    let memes = req.body;
    const statistics = await updateTemplateStatisticViewedAfterCreation(memes);
    return res.status(200).send(statistics);
});

router.get('/templates/delete-all', async (req, res) => {
    await deleteAllTemplateStatistics();
    return res.status(204).end();
});


// ----------- MEMES
router.get('/memes', async (req, res) => {
    const statistics = await getMemeStatistics();
    if (statistics) {
        return res.status(200).send(statistics);
    }
    return res.status(500).send({ error: 'error' });
});

router.post('/memes/viewed', async (req, res) => {
    let memes = req.body;
    const statistics = await createOrUpdateMultipleMemeStatisticViewed(memes);
    return res.status(200).send(statistics);
});


router.get('/memes/delete-all', async (req, res) => {
    await deleteAllMemeStatistics();
    return res.status(204).end();
});



module.exports = router