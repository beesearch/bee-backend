var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.findAll = function(req, res) {
	User.find(function (err, users) {
		if (err) {
			console.log(':( error while fetching users:' + err);
			return;
		}
		console.log('Fetched users:' + users);
		res.send(users);
	});
};
 
exports.findById = function(req, res) {
	User.find({ id: req.params.id }, function (err, user) {
		if (err) {
			console.log(':( error while fetching user:' + err);
			return;
		}
		console.log('Fetched user:' + users);
		res.send(user);
	})
};

exports.create = function(req, res) {
	var user = new UserModel({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		hashed_password: req.body.hashed_password,
		email: req.body.email
	});

	user.save(function (err, user) {
		if (err) {
			console.log(':( error while saving user:' + err);
			return;
		}
		console.log('Saved user:' + user);
		res.send(user);
	})
};
