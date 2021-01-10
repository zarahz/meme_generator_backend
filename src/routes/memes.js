const path = require("path");
const { promises: fs } = require("fs");
const multer = require("multer");
const { v4: uuid } = require('uuid');
const express = require('express');
const { getImages } = require('../lib/image')
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

router.get("/memes", async (req, res) => {
    const dbImages = await getImages();
    if (!dbImages) {
        return res.status(500).send("Error occured");
    }
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
        const comments = await getComments({ "imageId": meme._id });
        if (comments != -1) {
            meme.commentCount = comments.length;
        }
        // TODO upvotes and downvotes
        memes.push(meme);
    };
    return memes;
};


module.exports = router;