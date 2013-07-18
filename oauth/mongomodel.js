var model = module.exports;

model.getAccessToken = function (bearerToken, callback) {
	console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

	/*pg.connect(connString, function (err, client, done) {
		if (err) return callback(err);
		client.query('SELECT access_token, client_id, expires, user_id FROM oauth_access_tokens ' +
				'WHERE access_token = $1', [bearerToken], function (err, result) {
			// This object will be exposed in req.oauth.token
			// The user_id field will be exposed in req.user (req.user = { id: "..." }) however if
			// an explicit user object is included (token.user, must include id) it will be exposed
			// in req.user instead
			callback(err, result.rowCount ? result.rows[0] : false);
			done();
		});
	});*/
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

model.saveRefreshToken = function (refreshToken, clientId, userId, expires, callback) {
	pg.connect(connString, function (err, client, done) {
		if (err) return callback(err);
			client.query('INSERT INTO oauth_refresh_tokens(refresh_token, client_id, user_id, ' +
			'expires) VALUES ($1, $2, $3, $4)', [accessToken, clientId, userId, expires], function (err, result) {
			callback(err);
		});
	});
};

/*
 * Required to support password grant type
 */
model.getUser = function (username, password, callback) {
	console.log('in getUser (username: ' + username + ', password: ' + password + ')');
	var user = {id: '1'};
	callback(null, user);
};
