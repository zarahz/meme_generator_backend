const path = require("path");
const express = require('express');
const { createOrUpdateImageDraft, getImageDraft, deleteImageDraft, getAllImageDrafts } = require('../lib/imageDraft')
const { authenticateUserByJWT } = require('../lib/user');
const router = express.Router();
const { tokenVerification } = require('./middleware');

router.get("/all-image-drafts", async (req, res) => {
    //no draft possible if no token available
    const dbImageDrafts = await getAllImageDrafts();
    return res.status(200).send(dbImageDrafts);
});

router.get("/image-draft", tokenVerification, async (req, res) => {
    const dbImageDraft = await getImageDraft({ userId: req.user.id });
    if (!dbImageDraft) {
        return res.status(204).end();
    }
    return res.status(200).send(dbImageDraft);
});

router.post("/image-draft", tokenVerification, async (req, res) => {
    let draft = req.body;
    draft.userId = req.user.id;
    draft.creationDate = new Date();
    const dbImageDraft = await createOrUpdateImageDraft(draft);
    if (!dbImageDraft) {
        return res.status(500).send("Error occured");
    }
    return res.status(204).end();
});

router.delete("/delete-image-draft", tokenVerification, async (req, res) => {
    const dbImageDraft = await deleteImageDraft({ userId: req.user.id });
    if (!dbImageDraft) {
        return res.status(500).send("Error occured");
    }

    return res.status(200).send({ dbImageDraft });
});

router.delete("/delete-image-draft/:id", async (req, res) => {
    await deleteImageDraft({ _id: req.params.id });
    // if (!dbImageDraft) {
    //     return res.status(500).send("Error occured");
    // }
    return res.status(204).end();
});


module.exports = router;