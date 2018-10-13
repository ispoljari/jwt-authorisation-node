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
    console.info(`Connected to database at ${databaseUrl}`);
    server = app.listen(port, () => {
      console.log(`The server started to listen at ${port}`);
    });
  });
}

function closeServer() {
  mongoose.disconnect(() => {
    console.info(`Disconnected from database!`);

    server.close(err => {
      if (err) {
        console.error(err);
        return;
      }
      console.info(`The server is shutting down...`);
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}