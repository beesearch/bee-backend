var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

exports.findAll = function(req, res) {
	UserModel.find(function (err, users) {
		if (err) {
			console.err(':( error while fetching users:' + err);
			return;
		}
		//console.log('Fetched users:' + users);
		res.send(users);
	});
};
 
exports.findById = function(req, res) {
	UserModel.findOne({ id: req.params.id }, function (err, user) {
		if (err) {
			console.err(':( error while fetching user:' + err);
			return;
		}
		//console.log('Fetched user:' + users);
		res.send(user);
	})
};

exports.create = function(req, res) {
	console.log('User to save: ' + req.body.firstName);

	var user = new UserModel({
		id: req.body.id,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		hashed_password: req.body.hashed_password,
		email: req.body.email
	});

	user.save(function (err, user) {
		if (err) {
			console.err(':( error while saving user:' + err);
			return;
		}
		//console.log('Saved user:' + user);
		res.send(user);
	})
};
