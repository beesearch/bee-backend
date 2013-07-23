var model = module.exports;

model.getAccessToken = function (bearerToken, callback) {
	console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');
	var oauth_access_token = {access_token: bearerToken, client_id: 's6BhdRkqt3', expires: 'Thu Jul 18 2013 18:55:31 GMT+0200 (CEST)', user_id: '1'};
	callback(null, oauth_access_token);
};

model.getClient = function (clientId, clientSecret, callback) {
	console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');
	var client = {client_id: clientId, client_secret: clientSecret, redirect_uri: 'http://www.google.fr'};
	callback(null, client);
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
	callback(null);
};

/*
 * Required to support password grant type
 */
model.getUser = function (username, password, callback) {
	console.log('in getUser (username: ' + username + ', password: ' + password + ')');
	var user = {id: '1'};
	callback(null, user);
};
