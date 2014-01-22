// Dependencies
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var oauthserver = require('node-oauth2-server');

var enableCORS = function(req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

// MongoDB setup
require('./app/db/setup');

// Express setup
var app = express();
app.configure(function () {
	var oauth = oauthserver({
		model: require('./app/oauth/mongoose-oauth-model'),
		grants: ['password', 'refresh_token'],
		debug: true
	});
	app.use(enableCORS);
	app.use(express.logger());
	app.use(express.bodyParser());
	//app.use(oauth.handler());
	//app.use(oauth.errorHandler());
	app.use(app.router);
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Schemas and controllers
//require('./app/models/contactsSchema');
//var contacts = require('./app/controllers/contacts')
var elastic = require('./app/controllers/elastic')

// Routes
//app.get('/contacts', contacts.findAll);
//app.get('/contacts/:id', contacts.findById);
//app.put('/contacts', contacts.create);
app.get('/search', elastic.search);

// Keys definition for HTTPS
var options = {
  key: fs.readFileSync('keys/bee-key.pem'),
  cert: fs.readFileSync('keys/bee-cert.pem')
};

// Show must go on!
http.createServer(app).listen(8080);
//https.createServer(options, app).listen(443);
console.log ('Server started: HTTP & HTTPS are listening...');
