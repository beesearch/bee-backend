var mongoose = require('mongoose');
var ContactsModel = mongoose.model('Contacts');

exports.findAll = function(req, res) {
	ContactsModel.find(function (err, contacts) {
		if (err) {
			console.err(':( error while fetching contacts:' + err);
			return;
		}
		//console.log('Fetched contacts:' + contacts);
		res.send(contacts);
	});
};
 
exports.findById = function(req, res) {
	ContactsModel.findOne({ id: req.params.id }, function (err, contact) {
		if (err) {
			console.err(':( error while fetching contact:' + err);
			return;
		}
		//console.log('Fetched contact:' + contacts);
		res.send(contact);
	})
};

exports.create = function(req, res) {
	//console.log('contact to save: ' + req.body.firstname);

	var contact = new ContactsModel({
		id: req.body.id,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email
	});

	contact.save(function (err, contact) {
		if (err) {
			console.err(':( error while saving contact:' + err);
			return;
		}
		//console.log('Saved contact:' + contact);
		res.send(contact);
	})
};
