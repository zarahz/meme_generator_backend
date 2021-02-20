
const { Router } = require('express');
const { getTemplateStatistics, createOrUpdateMultipleTemplateStatisticViewed, updateTemplateStatisticChosen, updateTemplateStatisticGenerated } = require('../lib/Stats');

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

router.post('/templates/generated', async (req, res) => {
    let template = req.body;
    await updateTemplateStatisticGenerated(template.url);
    return res.status(204).end();
});

module.exports = router