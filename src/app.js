const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express')
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


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
