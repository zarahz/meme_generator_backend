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
        var top_text = req.query.top_text;
        var bottom_text = req.query.bottom_text;
        var top_x = req.query.top_x
        var top_y = req.query.top_y
        var bott_x = req.query.bott_x
        var bott_y = req.query.bott_y
        var file_name = await render_simple_meme(image_url, top_text, bottom_text, top_x, top_y, bott_x, bott_y);
        return res.status(200).send({
            path: "http://localhost:3000/static-rendered/" + file_name
        });
    }
);

module.exports = router;
