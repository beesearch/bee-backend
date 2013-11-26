// Dependencies
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var oauthserver = require('node-oauth2-server');
var mongoose = require('mongoose');

// Express setup
var app = express();
app.configure(function () {
	var oauth = oauthserver({
		model: require('./app/oauth/mongoose-oauth-model'),
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

// Db setup
require('./app/db');

// Schemas and controllers
require('./app/models/contactsSchema');
var contacts = require('./app/controllers/contacts')

// Routes
app.get('/contacts', contacts.findAll);
app.get('/contacts/:id', contacts.findById);
app.put('/contacts', contacts.create);

// Keys definition for HTTPS
var options = {
  key: fs.readFileSync('keys/bee-key.pem'),
  cert: fs.readFileSync('keys/bee-cert.pem')
};

// Show must go on!
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
console.log ('Server started: HTTP & HTTPS are listening...');