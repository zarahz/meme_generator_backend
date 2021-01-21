const path = require("path");
const { promises: fs } = require("fs");
const multer = require("multer");
const { v4: uuid } = require('uuid');
const express = require('express');
const { createImage, getImages, deleteImages, getImage } = require('../lib/image')
const { getComments } = require('../lib/comment')
const { authenticateUserByJWT } = require('../lib/user');
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
        let user = (req.cookies.token) && await authenticateUserByJWT(req.cookies.token);
        const tempPath = req.file.path;
        let name = uuid();
        const fileType = path.extname(req.file.originalname).toLowerCase();
        const imageData = {
            name,
            fileType,
            nameAndFileType: name + fileType,
            createdBy: (user) && user.id,
            creationDate: new Date(),
            visibility: req.body.visibility,
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

router.get("/image", async (req, res) => {
    const image = await getImage(req.query);
    if (!image || image == -1) {
        return res.status(500).send("Error occured");
    }

    if (image.visibility === "private") {
        //get the user if possible and check if the image belongs to him/her
        const user = (req.cookies.token) && await authenticateUserByJWT(req.cookies.token);
        if (!user || user === -1 || user.id !== image.createdBy) {
            return res.status(401).send({ error: 'Unauthorized!' });
        }
    }
    return res.status(200).send({ image });
});



// router.get("/images", async (req, res) => {
//     const dbImages = await getImages();
//     if (!dbImages) {
//         return res.status(500).send("Error occured");
//     }

//     return res.status(200).send(dbImages);
//     //res.sendFile(path.join(__dirname, "./uploads/image.png"));
// });

router.get("/delete-images", async (req, res) => {
    const dbImages = await deleteImages();
    if (!dbImages) {
        return res.status(500).send("Error occured");
    }
    //TODO empty upload folder too!
    return res.status(200).send(`Deleted ${dbImages.deletedCount} images`);
});


module.exports = router;