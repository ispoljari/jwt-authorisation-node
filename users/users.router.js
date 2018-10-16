'use strict';

const express = require('express');
const {User} = require('./models');

const router = express.Router();

router.post('/', (req, res) => {

  // Check if username and password are provided in the request body
  const requiredFields = ['username', 'password'];
  const missingFields = requiredFields.find(field => !(field in req.body));

  if (missingFields) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingFields
    });
  }
});