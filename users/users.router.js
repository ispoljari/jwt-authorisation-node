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

  // Check that all the fields are strings
  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringFields = stringFields.find(field =>
    field in req.body && typeof req.body[field] !== 'string');

  if (nonStringFields) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringFields
    });
  }

  // Check if username and password are trimmed. If they are not, send a warning to user. 

  const explicitlyTrimmedFields = ['username', 'password'];
  const nonTrimmedFields = explicitlyTrimmedFields.find(field => {
    req.body[field].trim() !== req.body[field]
  });

  if (nonTrimmedFields) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedFields
    });
  }

  
});