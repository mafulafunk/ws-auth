const express = require("express");
var cors = require('cors')
const mongoose = require("mongoose");
const dbURI = require("./config/keys").mongoURI;
const bodyParser = require("body-parser");

const passport = require("passport");
const users = require("./routes/api/users");

const app = express();

app.use(cors());
// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// DB Config
// Connect to MongoDB
    const db = mongoose.connection;

    db.on('connecting', function() {
        console.log('connecting to MongoDB...');
      });
    
      db.on('error', function(error) {
        console.error('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
      });
      db.on('connected', function() {
        console.log('MongoDB connected!');
      });
      db.once('open', function() {
        console.log('MongoDB connection opened!');
      });
      db.on('reconnected', function () {
        console.log('MongoDB reconnected!');
      });
      db.on('disconnected', function() {
        console.log('MongoDB disconnected!');
        mongoose.connect(dbURI, {server:{auto_reconnect:true}});
      });
    
      mongoose.connect(dbURI, 
        {
          useNewUrlParser: true,
          server: {auto_reconnect:true }
        });


// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));