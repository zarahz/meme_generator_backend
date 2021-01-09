const path = require("path");
const { promises: fs } = require("fs");
const multer = require("multer");
const { v4: uuid } = require('uuid');
const express = require('express');
const { createImage, getImages, deleteImages } = require('../lib/image')
const { getComments } = require('../lib/comment')
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
    "/upload",
    upload.single("file" /* name attribute of <file> element in your form */),
    async (req, res) => {
        const tempPath = req.file.path;
        let name = uuid();
        const fileType = path.extname(req.file.originalname).toLowerCase();
        const imageData = {
            name,
            fileType,
            nameAndFileType: name + fileType,
            creationDate: new Date()
        }
        const targetPath = path.join(__dirname, "../uploads/" + imageData.nameAndFileType);
        imageData.path = targetPath;

        await fs.rename(tempPath, targetPath);
        const dbImage = await createImage(imageData)
        if (!dbImage) {
            return res.status(500).send("Error occured");
        }

        return res.status(200).send({ dbImage });
    }
);

router.get("/images", async (req, res) => {
    const dbImages = await getImages();
    if (!dbImages) {
        return res.status(500).send("Error occured");
    }
    // add upvotecount, downvoteCount, commentCount to every image.
    var betterImageArray = await addInfoToMemeArray(dbImages);

    return res.status(200).send(betterImageArray);
    //res.sendFile(path.join(__dirname, "./uploads/image.png"));
});

async function addInfoToMemeArray(dbImages) {
    var memes = [];
    for (const element of dbImages) {
        var meme = JSON.parse(JSON.stringify(element));
        meme.commentCount = -1;
        meme.upvoteCount = -1;
        meme.downvoteCount = -1;
        const comments = await getComments(); // does this work?
        if (comments != -1) {
            meme.commentCount = comments.length;
        }
        // TODO upvotes and downvotes
        memes.push(meme);
    };
    return memes;
};

router.get("/delete-images", async (req, res) => {
    const dbImages = await deleteImages();
    if (!dbImages) {
        return res.status(500).send("Error occured");
    }
    //TODO empty upload folder too!
    return res.status(200).send(`Deleted ${dbImages.deletedCount} images`);
});


module.exports = router;