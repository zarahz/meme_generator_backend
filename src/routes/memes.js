const path = require("path");
const { promises: fs } = require("fs");
const multer = require("multer");
const { v4: uuid } = require('uuid');
const express = require('express');
const { getImages } = require('../lib/image')
const { getComments } = require('../lib/comment')
const { getUpvotes } = require('../lib/upvote')
const { getDownvotes } = require('../lib/downvote');
const { tokenVerification } = require("./middleware");

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

router.get("/user-memes", tokenVerification, async (req, res) => {
    const dbImages = await getImages({ createdBy: req.user.id });
    if (!dbImages) {
        return res.status(500).send("Error occured");
    }
    var betterImageArray = await addInfoToMemeArray(dbImages);

    return res.status(200).send(betterImageArray);
    //res.sendFile(path.join(__dirname, "./uploads/image.png"));
});

// TODO move to lib
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
        const upvoteCount = await getUpvotes({ "imageId": meme._id });
        if (upvoteCount != -1) {
            meme.upvoteCount = upvoteCount.length;
        }
        const downvoteCount = await getDownvotes({ "imageId": meme._id });
        if (downvoteCount != -1) {
            meme.downvoteCount = downvoteCount.length;
        }
        memes.push(meme);
    };
    return memes;
};


module.exports = router;