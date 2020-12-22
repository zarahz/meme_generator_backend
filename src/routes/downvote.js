const express = require('express');
const { createDownvote, getDownvotes, deleteDownvote} = require('../lib/upvote')

const router = express.Router();



router.get("/downvotes", async (req, res) => {
    const dbDownvotes = await getDownvotes(req.query);
    if (!dbUpvotes) {
        return res.status(500).send("Error occured");
    }
    return res.status(200).send({ dbDownvotes });
});

router.post('/post-downvote', async (req, res) => {
    try {
        const downvote = await createDownvote(req.body);
        if (upvote && Object.keys(downvote).length !== 0) {
            return res.status(200).send();
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