const { screenshotWebpage } = require('../lib/rendering');
const { createTemplate } = require('../lib/template')
const path = require("path");
const { promises: fs } = require("fs");
const express = require('express');
const router = express.Router();


const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

router.get("/screenshot_webpage", async (req, res) => {
    const templateData = await screenshotWebpage(req.query.webpage);

    const dbTemplate = await createTemplate(templateData)
    if (!dbTemplate) {
        return res.status(500).send("Error occured");
    }
    return res.status(200).send({ dbTemplate });

});

module.exports = router;
