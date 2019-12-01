const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const User = require('../../models/User');

router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({
      email: req.body.email
    });

    if (user) {
      return res.status(400).json({
        email: 'Email already exists'
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          const user = await newUser.save();
          return res.json(user);
        });
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server errror');
  }
});

router.post('/login', async (req, res) => {
  const errorMsg = 'Authentication failed';

  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({
        authFailure: errorMsg
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    console.log(password)
    console.log(user.password)
    if (isMatch) {
      const payload = {
        id: user.id,
        name: user.name,
        myPayload: 'Dieser Token ist nur zum Lesen gültig.'
      };
      jwt.sign(
        payload,
        config.get('secretOrKey'),
        {
          expiresIn: 180 // seconds
        },
        (err, token) => {
          return res.json({
            success: true,
            token: 'Bearer ' + token
          });
        }
      );
    } else {
      return res.status(400).json({
        authFailure: errorMsg
      });
    }
  } catch {
    console.error(err.message);
    return res.status(500).send('server errror');
  }
});

module.exports = router;
