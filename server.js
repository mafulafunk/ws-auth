const express = require('express');
var cors = require('cors');
const connectDB = require('./config/db');

const passport = require('passport');
const users = require('./routes/api/users');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(passport.initialize());
require('./config/passport')(passport);
app.use('/api/users', users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server up and running on port ${PORT} !`));
