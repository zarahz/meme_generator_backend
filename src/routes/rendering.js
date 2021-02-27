const { screenshotWebpage, render_simple_meme, zipFile } = require('../lib/rendering');
const { createTemplate } = require('../lib/template')
const path = require("path");
const { promises: fs } = require("fs");
const express = require('express');
const router = express.Router();
const multer = require("multer");
const { authenticateUserByJWT } = require('../lib/user');
const { tokenVerification } = require('./middleware');

router.get("/screenshot_webpage", async (req, res) => {
    const templateData = await screenshotWebpage(req.query.webpage);

    const dbTemplate = await createTemplate(templateData)
    if (!dbTemplate) {
        return res.status(500).send("Error occured");
    }
    return res.status(200).send({ dbTemplate });

});

router.get("/zipfile", async (req, res) => {
    const zipfile = await zipFile(req.query.searchterm);
    if (!zipfile) {
        return res.status(500).send("Error occured");
    }
    return res.status(200).send({
        path: "http://localhost:3000/static-rendered/" + zipfile
    })
});

router.post(
    "/render-simple-meme", async (req, res) => {
        var file_name = await render_simple_meme(req.body);
        return res.status(200).send({
            path: "http://localhost:3000/static-rendered/" + file_name
        });
    }
);

module.exports = router;
