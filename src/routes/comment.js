const path = require("path");
const { promises: fs } = require("fs");
const multer = require("multer");
const { v4: uuid } = require('uuid');
const express = require('express');
const { createComment, getComments, deleteComment, deleteComments } = require('../lib/comment')

//
const { getUser } = require('../lib/user');
const comment = require("../model/comment");
const { tokenVerification } = require("./middleware");
//

const router = express.Router();

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

router.get("/comments", async (req, res) => {
    var dbComments = await getComments(req.query);
    if (!dbComments) {
        return res.status(500).send("Error occured");
    }
    var betterComments = await addUserNameToCommentArray(dbComments);
    return res.status(200).send(betterComments);
});

async function addUserNameToCommentArray(dbComments) {
    var betterComments = [];
    for (const element of dbComments) {
        var comment = JSON.parse(JSON.stringify(element));
        const user = await getUser({ "_id": element.authorId });
        if (user === -1) { comment.username = "dummy"; }
        comment.username = user.username;
        betterComments.push(comment);
    };
    return betterComments;
};

router.post('/post-comment', tokenVerification, async (req, res) => {
    try {
        let commentSubmission = req.body;
        commentSubmission.authorId = req.user.id;
        const comment = await createComment(commentSubmission);
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