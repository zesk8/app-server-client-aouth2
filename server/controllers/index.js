'use strict';

var middleware 	= require('./../middleware');
var User 		= require('./../models').User;
var Client 		= require('./../models').OAuthClient;
var RefreshToken= require('./../models').oauth;
var profile 	= require('./../lib/profile');

module.exports = function (router) {

	// Home
	router.get(['/home', '/'], function(req, res) {
		if(!req.session.user)
			res.redirect('/login');

		res.render('index', {user: req.session.user});
	});

	router.get('/login', function(req, res) {
		res.render('login', {title: 'manoderecha - login'});
	});

	// API USERS
	// Get all users
	router.get('/api/v1/users', middleware.isAuthenticated, function(req, res) {
		User.find(function(error, users) {
			if(error)
				return res.json(error);

			res.json(users);
		})
	});

	// Create user
	router.post('/api/v1/users', function(req, res) {
		var model = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			isActive: req.body.isActive
		};

		var user = new User(model);
		user.save(function(error, user){
			if(error)
				return res.json(error);

			res.status(201).json(user);
		});
	});

	// Get one user
	router.get('/api/v1/users/:id', middleware.isAuthenticated, function(req, res) {
		User.findOne({_id: req.params.id}, function(error, user) {
			if(error || !user)
				return res.json(error);

			res.json(user);
		});
	});

	// update user
	router.put('/api/v1/users/:id', middleware.isAuthenticated, function(req, res) {
		User.findById(req.params.id, function(error, user) {
			user.username = req.body.username,
			user.email = req.body.email,
			user.password = req.body.password,
			user.isActive = req.body.isActive;

			return user.save(function(error, user) {
				if(error)
					return res.json(error);

				res.json(user);
			})
		});
	});

	router.delete('/api/v1/users/:id', middleware.isAuthenticated, function(req, res) {
		User.remove({_id: req.params.id}, function(error, user) {
			if(error)
				return json(error);

			res.status(204).json({'message': 'El usuario se ha eliminado correctamente.'});
		})
	});

	// API CLIENTS
	// Get all clients
	router.get('/api/v1/clients', middleware.isAuthenticated, function(req, res) {
		Client.find(function(error, clients) {
			if(error)
				return res.json(error);

			res.json(clients);
		})
	});

	// Create client
	router.post('/api/v1/clients', middleware.isAuthenticated, function(req, res) {
		var model = {
			clientId: req.body.clientId,
			clientSecret: req.body.clientSecret,
			redirectUri: req.body.redirectUri
		};

		var client = new Client(model);
		client.save(function(error, client){
			if(error)
				return res.json(error);

			res.status(201).json(client);
		});
	});

	// Get one client
	router.get('/api/v1/clients/:id', middleware.isAuthenticated, function(req, res) {
		Client.findOne({_id: req.params.id}, function(error, client) {
			if(error || !client)
				return res.json(error);

			res.json(client);
		});
	});

	// update client
	router.put('/api/v1/clients/:id', middleware.isAuthenticated, function(req, res) {
		Client.findById(req.params.id, function(error, client) {

			client.clientId = req.body.clientId;
			client.clientSecret = req.body.clientSecret;
			client.redirectUri = req.body.redirectUri;

			return client.save(function(error, client) {
				if(error)
					return res.json(error);

				res.json(client);
			})
		});
	});

	router.delete('/api/v1/clients/:id', middleware.isAuthenticated, function(req, res) {
		Client.remove({_id: req.params.id}, function(error, client) {
			if(error)
				return json(error);

			res.status(204).json({'message': 'El cliente se ha eliminado correctamente.'});
		})
	});

	router.get('/oauth/authorize', function(req, res, next) {
		if (!req.session.user) {
			return res.redirect('/login?redirect=' + req.path + '&client_id=' +
				req.query.client_id + '&redirect_uri=' + req.query.redirect_uri);
		}

		// Exist session on server and has previously authorized 
		var data = {
				client_id: req.query.client_id,
				redirect_uri: req.query.redirect_uri			
		};

		RefreshToken.authorized(req.session.user, function(error, refreshToken) {
			if(refreshToken && req.session.user) {
				res.render('decision', data);
			} else {
				res.render('authorize', data);
			}
		});
	});

	router.post('/login', function(req, res, next) {
		User.authenticate(req.body.username, req.body.password, function(error, user) {
			if(error)
				res.json(error);

			if(user) {
				req.session.user = user.username;

				if(req.query.redirect == null) {
					res.json({
						data: {
							'redirect': null}
						}
					);
				} else {
					RefreshToken.authorized(user.user, function(error, refreshToken) {
						// refresh token exist, is authorized
						if(refreshToken) {
							res.json({
								data: {
									'authorized': true,
									'redirect': '/decision',
									'client_id': req.query.client_id,
									'redirect_uri': req.query.redirect_uri
								}
							});
						} else {
							res.json({
								data: {
									'authorized': false,
									'redirect': req.query.redirect,
									'client_id': req.query.client_id,
									'redirect_uri': req.query.redirect_uri
								}
							});
						}
					})
				}
			} else {
				res.status(401).render('login');
			}
		});
	});

	router.get('/login', function(req, res, next) {
		res.render('login', { 
			title: 'manoderecha'
		});
	});

	router.get('/api/v1/users', middleware.isAuthenticated, function(req, res) {
		User.find(function(error, users) {
			if(error)
				res.json(error);

			res.json(users);
		})
	});

	router.get('/logout', middleware.isAuthenticated, function(req, res) {
		if(req.session.user) {
			req.session.user = null;

			// Temp: redirect to client for close all session's
			res.redirect('http://localhost:8000');
		}
	});

	// Profile user
	router.get('/api/userinfo', profile.info);
};