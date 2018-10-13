'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

mongoose.Promise = global.Promise;

let server;

function runServer(databaseUrl, port = PORT) {
  mongoose.connect(databaseUrl, err => {
    if (err) {
      console.error(err);
      return 
    }

    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}