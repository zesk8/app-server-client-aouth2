'use strict';

var express 	= require('express')
, kraken 		= require('kraken-js')
, http 			= require('http')
, port 			= process.env.PORT || 8000
, logger 		= require('morgan')
, cookieParser 	= require('cookie-parser')
, session 		= require('express-session')
, bodyParser 	= require('body-parser')
, passport 		= require('passport')
, User 			= require('./models').User
, mdStrategy 	= require('./lib/strategy').Strategy // extend Strategy - mdStrategy
, middleware 	= require('./middleware/authenticate')
, path 			= require('path')
, client_id 	= 'manoderecha'
, client_secret = 123456
, options;

// Config passport
// The purpose of the serialize function is to return sufficient identifying information
// to recover the user account on any subsequent requests. 
// Specifically the second parameter of the done() method
// is the information serialized into the session data.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Strategy config
passport.use(new mdStrategy({
		authorizationURL: 'http://localhost:3000/oauth/authorize',
		tokenURL: 'http://localhost:3000/oauth/token',
		clientID: client_id,
		clientSecret: client_secret,
		callbackURL: "http://localhost:8000/auth/md/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		profile.refreshToken = refreshToken;
		profile.expires = profile.expires;
		User.findOneAndUpdate({username: profile.username}, profile, {upsert: true}, function(err, user) {
			if(err)
				return done(err);

			return done(null, user);
		});
	}
));

// Config app
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
	secret: 'keyboard cat',
	name: 'md',
	store: false,
	proxy: false,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// url access for autenticate client app
app.get('/auth/md', passport.authenticate('md'));
app.get('/auth/md/callback', passport.authenticate('md', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/', middleware.isAuthenticated, function(req, res) {
	res.render('index', {user: req.user});
});

// Sessión close
app.get('/logout', middleware.isAuthenticated, function(req, res) {
	req.logout();

	// temp
	res.redirect('http://localhost:3000/logout');
});

module.exports = app;
app.listen(port, function() {
	console.log('[%s] Listening [Client] on http://localhost:%d', app.settings.env, port);
});