const { screenshotWebpage } = require('../lib/rendering');
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
    screenshotWebpage(req.query.webpage);
});

module.exports = router;
