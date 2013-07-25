var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ContactsSchema = new Schema({
	id: { type: Number },
	firstname: { type: String },
	lastname: { type: String },
	email: { type: String, default: '' }
});

mongoose.model('Contacts', ContactsSchema);
