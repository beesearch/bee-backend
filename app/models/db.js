var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, ':( Error while connecting to MongoDB:'));
db.once('open', function callback () {
	console.log(':) Connection to MongoDB successful!!');
});
