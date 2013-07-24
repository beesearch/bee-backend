var mongoose = require('mongoose')
	Schema = mongoose.Schema;
var model = module.exports;

//
// Schemas definitions
//
var OAuthAccessTokensSchema = new Schema({
	access_token: { type: String },
	client_id: { type: String },
	user_id: { type: String },
	expires: { type: Date }
});

var OAuthClientsSchema = new Schema({
	client_id: { type: String },
	client_secret: { type: String },
	redirect_uri: { type: String }
});

var UsersSchema = new Schema({
	id: { type: String },
	username: { type: String },
	password: { type: String }
});

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
mongoose.model('OAuthClients', OAuthClientsSchema);
mongoose.model('Users', UsersSchema);

var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens'),
	OAuthClientsModel = mongoose.model('OAuthClients'),
	UsersModel = mongoose.model('Users');

//
// node-oauth2-server callbacks
//
model.getAccessToken = function (bearerToken, callback) {

	console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

	OAuthAccessTokensModel.findOne({ access_token: bearerToken }, function (err, accessToken) {
		if (err) {
			return callback(err);
		}
		callback(null, accessToken);
	});
};

model.getClient = function (clientId, clientSecret, callback) {
	console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

	OAuthClientsModel.findOne({ client_id: clientId, client_secret: clientSecret }, function (err, client) {
		if (err) {
			return callback(err);
		}
		callback(null, client);
	});
};

// This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
// it gives an example of how to use the method to resrict certain grant types
var authorizedClientIds = ['s6BhdRkqt3', 'toto'];
model.grantTypeAllowed = function (clientId, grantType, callback) {
	console.log('in grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');

	if (grantType === 'password') {
		return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
	}

	callback(false, true);
};

model.saveAccessToken = function (accessToken, clientId, userId, expires, callback) {
	console.log('in saveAccessToken (accessToken: ' + accessToken + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');
	
	var accessToken = new OAuthAccessTokensModel({
		access_token: accessToken,
		client_id: clientId,
		user_id: userId,
		expires: expires
	});

	accessToken.save(accessToken, function (err, token) {
		if (err) {
			return callback(err);
		}
	});

	return callback(null);
};

/*
 * Required to support password grant type
 */
model.getUser = function (username, password, callback) {
	console.log('in getUser (username: ' + username + ', password: ' + password + ')');

	UsersModel.findOne({ username: username, password: password }, function (err, user) {
		if (err) {
			return callback(err);
		}
		return callback(null, user);
	});
};
