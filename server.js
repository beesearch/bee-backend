// Dependencies
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var oauthserver = require('node-oauth2-server');
var mongoose = require('mongoose');

var enableCORS = function(req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		// Accept CORS request,
		// Client will then send the real request
		res.send(200);
	} else {
		// Pass to next layer of middleware
		next();
	}
};

// Express setup
var app = express();
app.configure(function () {
	var oauth = oauthserver({
		model: require('./app/oauth/mongoose-oauth-model'),
		grants: ['password'],
		debug: true
	});
	app.use(enableCORS);
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(oauth.handler());
	app.use(oauth.errorHandler());
	app.use(app.router);
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