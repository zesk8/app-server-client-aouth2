'use strict';

var express 	= require('express')
, kraken 		= require('kraken-js')
, debug			= require('morgan')
, bodyParser 	= require('body-parser')
, path 			= require('path')
, models 		= require('./models')
, middleware 	= require('./middleware')
, oauth2Server 	= require('node-oauth2-server')
, enrouten 		= require('express-enrouten')
, cookieParser 	= require('cookie-parser')
, session		= require('cookie-session')
, port 			= process.env.PORT || 3000
, app 			= express()
, options;

// All environments
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	keys: ['user']
}));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');

// development only
if('development' == app.get('env')) {
	app.use(debug('dev'));
}

app.oauth = oauth2Server({
	model: models.oauth,
	grants: ['password', 'authorization_code', 'refresh_token'],
	debug: true
});

app.all('/oauth/token', app.oauth.grant());

// Handle authorize
app.post('/oauth/authorize', function(req, res, next) {
	if (!req.session.user) {
		return res.redirect('/login?redirect=' + req.path + 'client_id=' + req.query.client_id +'&redirect_uri=' + req.query.redirect_uri);
	}

	next();
}, app.oauth.authCodeGrant(function(req, next) {
	// The first param should to indicate an error
	// The second param should a bool to indicate if the user did authorise the app
	// The third param should for the user/uid (only used for passing to saveAuthCode)
	next(null, req.body.allow === 'yes', req.session.user, null);
}));

// Only when the user has previously authorized
app.get('/decision', function(req, res) {
	res.render('decision', {
		client_id: req.query.client_id,
		redirect_uri: req.query.redirect_uri
	});
});

// Middleware route for express - kraken
app.use(enrouten({index: 'controllers/'}));

// Error middleware Oauth2 server
app.use(app.oauth.errorHandler());

// authorize middleware oauth2
app.use('/api/*', middleware.isAuthenticated);

module.exports = app;
app.listen(port, function() {
	console.log('[%s] Listening [Server] on http://localhost:%d', app.settings.env, port);
});