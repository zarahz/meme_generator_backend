const { screenshotWebpage, render_simple_meme } = require('../lib/rendering');
const { createTemplate } = require('../lib/template')
const path = require("path");
const { promises: fs } = require("fs");
const express = require('express');
const router = express.Router();
const multer = require("multer");
const { authenticateUserByJWT } = require('../lib/user');
const { tokenVerification } = require('./middleware');


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

router.get(
    "/render-simple-meme", async (req, res) => {
        var image_url = req.query.template_image_url;
        var rendered_image_url = await render_simple_meme(image_url, "HI", "THERE", 30, 30, 30, 200);
        console.log("render-simple-meme " + image_url);
        return res.status(200).send({ success: true });
    }
);

module.exports = router;
