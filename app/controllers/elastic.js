
exports.search = function(req, res) {
	console.log('in search');

	var search = req.query.search;
	var page = parseInt(req.query.page) | 1;
	var length = parseInt(req.query.length) | 10;
	console.log('search: ' + search);
	console.log('page: ' + page);
	console.log('length: ' + length);

	// Calculating start and end elements
	var start = (page - 1) * length;
	var end = (start + length) - 1;

	var result = [];
	for (var i = start; i <= end; i++) {
		result.push({'id': i, 'text': 'Result number: ' + i, 'now': new Date().toJSON()});
	};

	console.log('result: ' + JSON.stringify(result));
	res.send(result);
}

exports.data = function(req, res) {
	res.send({'type': 'Hello', 'now': new Date().toJSON()});
}
