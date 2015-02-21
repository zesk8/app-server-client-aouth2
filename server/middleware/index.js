'use strict';

function isAuthenticated(req, res, next) {
	// TO-DO Bearer authorise (APPs)

	if(req.session.user) {
		req.user = { id: req.session.user }
		next();
	} else {
		res.app.oauth.authorise()(req, res, next);
	}

}

module.exports.isAuthenticated = isAuthenticated;