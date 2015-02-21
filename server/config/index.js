'use strict';

var nodeEnv = process.env.NODE_ENV || 'development';
var config = {
	development: require('./development')
};

module.exports = config[nodeEnv];