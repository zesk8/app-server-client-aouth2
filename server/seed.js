var app = require('./index');
var models = require('./models');

models.User.create({
  username: 'ba',
  email: 'ba@manoderecha.mx',
  password: 'ba',
  isActive: true
}, function() {
  models.OAuthClient.create({
    clientId: 'manoderecha',
    clientSecret: '123456',
    redirectUri: 'http://localhost:8000/auth/md/callback'
  }, function() {
    process.exit();
  });
});