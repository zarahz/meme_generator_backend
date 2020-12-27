const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const config = require('../config');
require('./db');

const app = express()
const port = 3000

// cors settings to allow the whitelist urls to access the api
const whitelist = ['localhost'];
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

app.use(cookieParser(config.secret))
app.use(bodyParser.json());
app.options('*', cors());


app.use('/static', express.static(__dirname + '/uploads'));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// image API
app.use(require('./routes/image'));
// user API
app.use(require('./routes/user'));
// user API
app.use(require('./routes/authentification'));

app.use(require('./routes/comment'));
// upvote API
app.use(require('./routes/upvote'));
// downvote API
app.use(require('./routes/downvote'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
