/**
* Module dependencies.
*/

var uri 	= require('url')
  , crypto 	= require('crypto')
  , util 	= require('util')
  , OAuth2Strategy 		= require('passport-oauth2')
  , InternalOAuthError 	= require('passport-oauth2').InternalOAuthError;

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'http://localhost:3000/oauth/authorize';
  options.tokenURL = options.tokenURL || 'http://localhost:3000/oauth/token';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'md';
}

util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from md.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `md`
 *   - `username`         the md username
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
	this._oauth2.getProtectedResource('http://localhost:3000/api/userinfo', accessToken, function (err, body, res) {
		if (err) {
			return done(new InternalOAuthError('Failed to fetch user profile', err));
		}

		try { 
			var json = JSON.parse(body);
			var profile = { provider: 'md' };

			profile.username = json.username;
			profile.expires = json.expires;
			profile.accessToken = json.accessToken;

			done(null, profile);
		} catch(e) {
			done(e);
		}
	});
}

/**
* Expose `Strategy`.
*/
exports.Strategy = Strategy;
