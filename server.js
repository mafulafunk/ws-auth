const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const dbURI = require('./config/keys').mongoURI;
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const passport = require('passport');
const users = require('./routes/api/users');

const app = express();

connectDB();

app.use(cors());
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);
// Routes
app.use('/api/users', users);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
