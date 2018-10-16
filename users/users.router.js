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

  // Check if username and password have the required min and max length

  const sizedFields = {
    username: {
      min: 1
    },

    password: {
      min: 10,
      max: 72
    }
  };

  const tooSmallField = Object.keys(sizedFields).find(field => 
    'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
  );

  const tooLargeField = Object.keys(sizedFields).find(field => 
    'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
  );
  
  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField ? `Must be at least ${sizedFields[tooSmallField].min}` : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;

  User.find({username})
    .count()
    .then(count => {
      if(count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then(user => res.status(201).json(user.serialize())
    )
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      return res.status(500).json({code: 500, message: 'Internal server Error!'});
    });
});

module.exports = {router};