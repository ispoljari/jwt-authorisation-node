'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

// Override mongoose Promises with native ES6 promises

mongoose.Promise = global.Promise;

// import app parameters from the config files

const {DATABASE_URL, PORT} = require('./config');

// Setup server-side middleware
const app = express();

// Logging
app.use(morgan('common'));

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  if(req.method === 'OPTIONS') {
    return res.send(204);
  }

  next();
});

// Body parsing middleware
app.use(express.json());

// Import router modules; /users & /auth
const {router: usersRouter} = require('./users');
const {router: authRouter} = require('./auth');

// Route handlers for /users/ & /auth/ endpoints
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

// Return a message if root endpoint is visited
app.use('*', (req, res) => 
  res.status(404).json({message: 'Not Found'})
);

// Run / Close Server

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