const path = require("path");
const express = require('express');
const { createImageDraft, getImageDrafts, deleteImageDrafts, getAllImageDrafts } = require('../lib/imageDraft')
const router = express.Router();
const { tokenVerification } = require('./middleware');
const { Caption } = require("../model");

router.get("/all-image-drafts", async (req, res) => {
    const dbImageDrafts = await getAllImageDrafts();
    return res.status(200).send(dbImageDrafts);
});

router.get("/image-draft/:id", tokenVerification, async (req, res) => {
    const dbImageDraft = await getImageDrafts({ _id: req.params.id, userId: req.user.id });
    if (!dbImageDraft) {
        return res.status(204).end();
    }
    return res.status(200).send(dbImageDraft);
});

router.get("/image-drafts", tokenVerification, async (req, res) => {
    const dbImageDrafts = await getImageDrafts({ userId: req.user.id });
    if (!dbImageDrafts) {
        return res.status(204).end();
    }
    return res.status(200).send(dbImageDrafts);
});

router.post("/image-draft", tokenVerification, async (req, res) => {
    let draft = req.body;
    draft.userId = req.user.id;
    draft.creationDate = new Date();
    const dbImageDraft = await createImageDraft(draft);
    if (!dbImageDraft) {
        return res.status(500).send("Error occured");
    }
    return res.status(204).end();
});

router.delete("/delete-image-drafts", tokenVerification, async (req, res) => {
    const dbImageDraft = await deleteImageDrafts({ userId: req.user.id });
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