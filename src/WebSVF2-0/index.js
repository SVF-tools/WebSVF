const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const tempPath = `${path.resolve('./')}/temp/`;
if (!fs.existsSync(tempPath)) {
  console.log(`Creating directory ${tempPath}`);
  fs.mkdirSync(tempPath);
}

const mongoose = require('mongoose');
const keys = require('./config/creds');
require('./models/Users');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(keys.mongoURI);

const app = express();

//Express Middlewares
//app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//Import Routes
require('./routes/userCode')(app);
require('./routes/db')(app);
require('./routes/builds')(app);
require('./routes/analysis')(app);

const PORT = process.env.PORT || 5001;
app.listen(PORT);
