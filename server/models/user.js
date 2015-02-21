'use strict';

var bcrypt 			 = require('bcrypt-nodejs');
var mongoose 		 = require('mongoose');
var Schema 			 = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var User = new Schema({
	username: 		{
		type: 			String,
		unique: 		true,
		required: 		true,
		lowercase: 		true
	},
	email: 			{
		type: 			String,
		unique: 		true,
		required: 		true,
		validate: 		[validateEmail, 'Please fill a valid email address']
	},
	password:       {
		type: 			String,
		required: 		true,
		unique: 		true
	},
	salt: 			{
		type: 			String,
		unique: 		true
	},
	isActive: 		{
		type: 			Boolean,
		required: 		true,
		default: 		true
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

// Execute before each user.save() call
User.pre('save', function(next) {
	var user = this;
	// only hash the password if it has been modified (or is new)
	if(!user.isModified('password'))
		return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt) {
		if(error)
			return next(error);

		// hash the password along with our new salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if(err)
				return next(err);

			// override the cleartext password with the hashed one
			user.salt 		= salt;
			user.password 	= hash;
			next();
		});
	});
});

User.static('authenticate', function(username, password, callback) {
	this.findOne({ username: username }, function(error, user) {
		if (error || !user)
			return callback(error);

		callback(null, bcrypt.compareSync(password, user.password) ? user : null);
	});
});

User.static('getUser', function(username, password, callback) {
	OAuthUsersModel.authenticate(username, password, function(error, user) {
	if (error || !user)
		return callback(error);

		callback(null, user.username);
	});
});

User.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
		if(error)
			return callback(error);

		callback(null, isMatch);
	});
};

mongoose.model('users', User);
var OAuthUsersModel = mongoose.model('users');
module.exports 		= OAuthUsersModel; 