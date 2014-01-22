
exports.search = function(req, res) {
	var start = req.params.start;
	var length = req.params.length;
	var result = [];

	console.log('start: ' + start);
	console.log('length: ' + length);

	for (var i = length - 1; i >= 0; i--) {
		result[i] = 'Result number : ' + i;
	};

	return result;
}
