var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Code = new Schema({
	authCode: 		{
		type: 			String,
		required: 		true,
		unique: 		true
	},
	clientId: 		{
		type: 			String
	},
	userId: 		{
		type: 			String,
		required: 		true
	},
	expires: 		{
		type: 			Date
	}
});

mongoose.model('oauth_authcodes', Code);
var OAuthAuthCodeModel = mongoose.model('oauth_authcodes');

module.exports.getAuthCode = function(authCode, callback) {
	OAuthAuthCodeModel.findOne({ authCode: authCode }, callback);
};

module.exports.saveAuthCode = function(code, clientId, expires, userId, callback) {
	var fields = {
		clientId: 	clientId,
		userId: 	userId,
		expires: 	expires
	};

	OAuthAuthCodeModel.update({ authCode: code }, fields, { upsert: true }, function(error) {
		if(error) {
			console.error(error);
		}

		callback(error);
	});
};
