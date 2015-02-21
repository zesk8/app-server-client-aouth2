'use strict';
var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;

var User = new Schema({
	username: 		{
		type: 			String,
		required: 		true
	},
	accessToken: 	{
		type: 			String,
		unique: 		true,
		required: 		true
	},
	refreshToken: 	{
		type: 			String,
		required: 		true
	},
	expires:        {
		type:           Date,
		required:       true
	},
	provider:       {},
	github: 		{}	
});

module.exports = mongoose.model('users', User);
