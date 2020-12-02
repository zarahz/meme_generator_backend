const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cors = require('cors');
const bodyParser = require('body-parser');

const express = require('express')
const app = express()
const port = 3000

// cors settings to allow the whitelist urls to access the api
const whitelist = ['pwp.um.ifi.lmu.de', 'localhost'];
const checkUrl = (origin, callback) => {
  // check if the current url is contained in the whitelist
  let match = false;
  whitelist.forEach((entry) => {
    if (!match && (
      !origin || origin.includes(entry))) {
      callback(null, true);
      match = true;
    }
  });
  // if no whitelist entry matched do not allow access
  if (!match) {
    callback(new Error('Not allowed by CORS'));
  }
};
// activate the cors functionality
app.use(cors({ credentials: true, origin: checkUrl }));

app.use(bodyParser.json());

app.options('*', cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/temp"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});


app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase();
    const imageName = `${new Date().getTime()}${fileType}`;
    const targetPath = path.join(__dirname, "./uploads/" + imageName);

    //if (fileType === ".png") {
    fs.rename(tempPath, targetPath, err => {
      if (err) return handleError(err, res);

      return res
        .status(200)
        .contentType("text/plain")
        .end("File uploaded!");
    });
    /*} else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        return res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }*/
  }
);

app.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})