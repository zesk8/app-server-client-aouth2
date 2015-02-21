'use strict';

var mongoose 	= require('mongoose');

mongoose.connect('localhost/cliente3', {});

module.exports.User = require('./user');
