var express = require('express');

var app = express();
 
app.get('/users', function(req, res) {
	res.send([{name:'Mickey Mouse'}, {name:'Minnie Mouse'}]);
});
app.get('/users/:id', function(req, res) {
	res.send({id:req.params.id, firstName: "Mickey", lastName: "Mouse"});
});
 
app.listen(3000);
console.log('Listening on port 3000...');
