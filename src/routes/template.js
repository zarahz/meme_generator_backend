const path = require("path");
const { promises: fs } = require("fs");
const multer = require("multer");
const { v4: uuid } = require('uuid');
const express = require('express');
const { createTemplate, getTemplates, deleteTemplates, getTemplate } = require('../lib/template')
const router = express.Router();

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

const upload = multer({
    dest: "./temp"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

router.post(
    "/upload-template",
    upload.single("templatefile" /* name attribute of <file> element in your form */),
    async (req, res) => {
        const tempPath = req.file.path;
        let tags = req.body.tags;
        let fileName = uuid();
        const fileType = path.extname(req.file.originalname).toLowerCase();
        let url = ("http://localhost:3000/static-templates/" + fileName + fileType);

        const templateData = {
            fileName,
            tags,
            url,
            fileType,
            nameAndFileType: fileName + fileType,
            isWebScreenshot: false
        }
        const targetPath = path.join(__dirname, "../templates/" + templateData.nameAndFileType);
        templateData.path = targetPath;

        await fs.rename(tempPath, targetPath);
        const dbTemplate = await createTemplate(templateData)
        if (!dbTemplate) {
            return res.status(500).send("Error occured");
        }

        return res.status(200).send({ dbTemplate });
    }
);

router.get("/template", async (req, res) => {
    const template = await getTemplate(req.query);
    if (!template || template == -1) {
        return res.status(500).send("Error occured");
    }
    console.log("returning template: " + JSON.stringify(template));
    return res.status(200).send({ template });
});



router.get("/templates", async (req, res) => {
    const dbTemplates = await getTemplates();
    if (!dbTemplates) {
        return res.status(500).send("Error occured");
    }

    return res.status(200).send(dbTemplates);
    //res.sendFile(path.join(__dirname, "./uploads/template.png"));
});

router.get("/delete-templates", async (req, res) => {
    const dbTemplates = await deleteTemplates();
    if (!dbTemplates) {
        return res.status(500).send("Error occured");
    }
    //TODO empty upload folder too!
    return res.status(200).send(`Deleted ${dbTemplates.deletedCount} templates`);
});


module.exports = router;