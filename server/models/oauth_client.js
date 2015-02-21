'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Test
var authorizedClientIds = ['manoderecha', 'facturito'];

var Client = new Schema({
	clientId: 		{
		type: 			String,
		required: 		true,
		unique: 		true
	},
	clientSecret: 	{
		type: 			String,
		required: 		true,
		unique: 		true
	},
	redirectUri: 	{
		type: 			String,
		required: 		true
	},
	createdAt: 		{
		type: 			Date,
		required: 		true,
		default: 		Date.now
	},
	updatedAt: 		{
		type: 			Date,
		required: 		true,
		default: 		Date.now
	}
});

Client.static('getClient', function(clientId, clientSecret, callback) {
	var params = { clientId: clientId };
	if(clientSecret != null) {
		params.clientSecret = clientSecret;
	}

	OAuthClientsModel.findOne(params, callback);
});

Client.static('grantTypeAllowed', function(clientId, grantType, callback) {
	if(grantType === 'password' || grantType === 'authorization_code') {
		return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
	}

	callback(false, true);
});

mongoose.model('oauth_clients', Client);
var OAuthClientsModel = mongoose.model('oauth_clients');

module.exports = OAuthClientsModel;
