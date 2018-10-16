'use strict';

const {router} = require('./auth.router');
const {localStrategy, jwtStrategy} = require('./auth.strategies');

module.exports = {router, localStrategy, jwtStrategy};