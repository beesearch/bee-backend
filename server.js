// Dependencies
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var oauthserver = require('node-oauth2-server');

// Config
var config = require('./config.json');

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
var elastic = require('./app/controllers/elastic');

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
if (config.http.enabled) {
	http.createServer(app).listen(config.http.port);
	console.log ('Server started: HTTP listening on port ' + config.http.port);
};
if (config.https.enabled) {
	https.createServer(options, app).listen(config.https.port);
	console.log ('Server started: HTTPS listening on port ' + config.https.port);
};
