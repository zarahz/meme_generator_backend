
const { promises: fs } = require("fs");

const express = require('express');
const { createUpvote, getUpvotes, deleteUpvote } = require('../lib/upvote')

const router = express.Router();


router.get("/upvotes", async (req, res) => {
    const dbUpvotes = await getUpvotes(req.query);
    if (!dbUpvotes) {
        return res.status(500).send("Error occured");
    }
    return res.status(200).send({ dbUpvotes });
});

router.post('/post-upvote', async (req, res) => {
    try {
        const upvote = await createUpvote(req.body);
        if (upvote && Object.keys(upvote).length !== 0) {
            return res.status(200).send();
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
    return res.status(500).send({ error: 'error' });
});

router.post('/deleteupvote', async (req, res) => {

    try {
        await deleteUpvote();
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
    return res.status(200).send();
});

module.exports = router;