var AccessToken = require('./../models/oauth_accesstoken');

module.exports.info = function(req, res) {
	AccessToken.getAccessToken(req.query.access_token, function(err, user) {
		res.json({ username: user.userId[0].id, expires: user.expires, accessToken: user.accessToken })
	});
}