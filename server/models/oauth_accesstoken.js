'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccessToken = new Schema({
	accessToken: 	{
		type: 			String,
		required: 		true,
		unique: 		true
	},
	clientId: 		{
		type: 			String
	},
	userId: 		{
		type: 			Array,
		required: 		true
	},
	expires: 		{
		type: 			Date
	},
	createdAt: 		{
		type:        	Date,
		required:    	true,
		default:     	Date.now
	}
});

mongoose.model('oauth_accesstokens', AccessToken);
var OAuthAccessTokensModel = mongoose.model('oauth_accesstokens');

module.exports.getAccessToken = function(bearerToken, callback) {
	OAuthAccessTokensModel.findOne({ accessToken: bearerToken }, callback);
};

module.exports.saveAccessToken = function(token, clientId, expires, userId, callback) {
	var fields = {
		clientId: 	clientId,
		userId: 	userId,
		expires: 	expires
	};

	OAuthAccessTokensModel.update({ accessToken: token }, fields, { upsert: true }, function(error) {
		if(error) {
			console.error(error);
		}

		callback(error);
	});
};
