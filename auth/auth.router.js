'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const localAuth = passport.authenticate('local', {session: false});

router.post('/login', localAuth, (req, res) => {
  //some code here
});

module.exports = {router};