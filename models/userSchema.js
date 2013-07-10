var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	id: { type: Number },
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	email: { type: String, default: '' },
	hashed_password: { type: String, default: '' }
});

mongoose.model('User', UserSchema);
