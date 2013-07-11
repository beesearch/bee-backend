var express = require('express');
var mongoose = require('mongoose');
require('./models/db');
require('./models/userSchema');
var users = require('./controllers/users')

var app = express();

app.configure(function () {
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(app.router);
	//app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}); 

app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.put('/users', users.create);

app.listen(3000);
console.log('Listening on port 3000...');
