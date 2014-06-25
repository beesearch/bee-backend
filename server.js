// Dependencies
var fs = require('fs'),
	http = require('http'),
	https = require('https'),
	express = require('express'),
	oauthserver = require('node-oauth2-server'),
	elasticsearch = require('elasticsearch');

// Env and config
var env = process.env.NODE_ENV || 'development',
	config = require('./config.' + env + '.json');
console.log('### Environment: ' + env);

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

// ElasticSearch setup
var esclient = new elasticsearch.Client({
  host: config.elasticsearch.host,
  log: config.elasticsearch.log
});
exports.esclient = esclient;

// Express setup
var app = express();
app.configure(function () {
	app.oauth = oauthserver({
		accessTokenLifetime: 3600, // 1 hour
		refreshTokenLifetime: 86400, // 1 day
		model: require('./app/oauth/mongoose-oauth-model'),
		grants: ['password', 'refresh_token'],
		debug: true
	});
	app.use(enableCORS);
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.errorHandler());
	app.use(app.oauth.errorHandler());
});

// OAuth configuration
if (config.oauth.enabled) {
	console.log('### OAuth 2.0 is enabled');
	app.all('/oauth/token', app.oauth.grant());
} else {
	console.log('### OAuth 2.0 is disabled');
	// Override the authorise function
	app.oauth.authorise = function () {
		return function (req, res, next) { next(); };
	};
}

// Controllers
var elastic = require('./app/controllers/elastic');
var model = require('./app/controllers/model');

// Routes
app.get('/elastic', app.oauth.authorise(), elastic.fuzzySearch);
app.get('/type/:type/index/:index/id/:id', app.oauth.authorise(), model.getModel);

// Show must go on!
if (config.https.enabled) {
	var port = config.https.port || 443;

	// Keys definition for HTTPS
	var options = {
		key: fs.readFileSync('keys/bee-key.pem'),
		cert: fs.readFileSync('keys/bee-cert.pem')
	};

	https.createServer(options, app).listen(port);
	console.log ('### Server started: HTTPS listening on port ' + port);
} else if (config.http.enabled) {
	var port = config.http.port || 80;
	http.createServer(app).listen(port);
	console.log ('### Server started: HTTP listening on port ' + port);
}
