'use strict';

var config 		= require('./../config');
var mongoose 	= require('mongoose');

mongoose.connect(config.db, {});

module.exports.oauth 				= require('./oauth');
module.exports.User 				= require('./user');
module.exports.OAuthClient 			= require('./oauth_client');
module.exports.mongoose 			= mongoose;
