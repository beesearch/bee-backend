
exports.search = function(req, res) {
	var page = parseInt(req.query.page);
	var length = parseInt(req.query.length);
	var result = [];

	// Calculating start and end elements
	var start = (page - 1) * length;
	var end = (start + length) - 1;

	console.log('page: ' + page);
	console.log('length: ' + length);
	console.log('start: ' + start);
	console.log('end: ' + end);

	for (var i = start; i <= end; i++) {
		result.push({'id': i, 'text': 'Result number : ' + i});
	};

	res.send(result);
}

exports.getData = function(req, res) {
	res.send({'type': 'Hello', 'now': Date.now});
}
