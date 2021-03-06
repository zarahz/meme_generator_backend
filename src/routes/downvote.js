const express = require('express');
const { createDownvote, getDownvotes, deleteDownvote } = require('../lib/downvote');
const { updateTemplateStatisticDownvoted } = require('../lib/Stats');
const { tokenVerification } = require('./middleware');
const router = express.Router();


router.get("/downvotes", async (req, res) => {
    const dbDownvotes = await getDownvotes(req.query);
    if (!dbDownvotes) {
        return res.status(500).send("Error occured");
    }
    return res.status(200).send({ dbDownvotes });
});

router.post('/post-downvote', tokenVerification, async (req, res) => {
    try {
        let downvoteSubmission = req.body;
        downvoteSubmission.authorId = req.user.id;
        const downvote = await createDownvote(downvoteSubmission);
        await updateTemplateStatisticDownvoted(downvote.imageId);
        if (downvote && Object.keys(downvote).length !== 0) {
            return res.status(200).send(downvote);
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
    return res.status(500).send({ error: 'error' });
});

router.post('/deletedownvote', async (req, res) => {

    try {
        await deleteDownvote();
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
    return res.status(200).send();
});

module.exports = router;