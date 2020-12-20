const path = require("path");
const { promises: fs } = require("fs");
const multer = require("multer");
const { v4: uuid } = require('uuid');
const express = require('express');
const { createComment, getAllComments, getComments, deleteComment, deleteComments } = require('../lib/comment')

const router = express.Router();

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

router.get("/comments", async (req, res) => {
    const dbComments = await getComments(req.body);
    if (!dbComments) {
        return res.status(500).send("Error occured");
    }

    return res.status(200).send({ dbComments });
});

router.get("/allcomments", async (req, res) => {
    const dbComments = await getAllComments();
    if (!dbComments) {
        return res.status(500).send("Error occured");
    }

    return res.status(200).send({ dbComments });
});

router.post('/post-comment', async (req, res) => {
    try {
        const comment = await createComment(req.body);
        if (comment && Object.keys(comment).length !== 0) {
            return res.status(200).send();
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
    return res.status(500).send({ error: 'error' });
});

router.post('/deleteallcomments', async (req, res) => {

    try {
        await deleteComments();
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
    return res.status(200).send();
});

module.exports = router;