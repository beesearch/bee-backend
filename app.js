var express = require('express');
var mongoose = require('mongoose');
require('./models/db');
require('./models/userSchema');
var users = require('./controllers/users')

var app = express();

app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.create);

app.listen(3000);
console.log('Listening on port 3000...');
