// Dependencies
var express = require('express');
var oauthserver = require('node-oauth2-server');
var mongoose = require('mongoose');

// Schemas and controllers
require('./models/db');
require('./models/contactsSchema');
var contacts = require('./controllers/contacts')

// Express setup
var app = express();
app.configure(function () {
	var oauth = oauthserver({
		model: require('./oauth/mongoose-oauth-model'),
		grants: ['password'],
		debug: true
	});
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(oauth.handler());
	app.use(oauth.errorHandler());
	app.use(app.router);
	//app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}); 

// Routes
app.get('/contacts', contacts.findAll);
app.get('/contacts/:id', contacts.findById);
app.put('/contacts', contacts.create);

// Show must go on!
app.listen(3000);
console.log('Listening on port 3000...');
