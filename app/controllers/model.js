var async = require("async");

// ElasticSearch client
var esclient = require('../../server').esclient;

exports.getModel = function(req, res) {
	console.log('### in getModel (type: ' + req.param("type") + ', index: ' + req.param("index")  + ' , id: ' + req.param("id") + ')');

	var type = req.param("type");
	var index = req.param("index");
	var id = req.param("id");

	var result;
	if (type === 'customer') {
		result = getCompany(type, index, id, res);
	} else {
		res.send('type not found');
	}

	console.log('### out getModel');
}

function getCompany(type, index, id, res) {

	async.parallel({
		companyDatas: function(callback) { getCompanyDatas(type, index, id, callback) },
		companyTop5Chart: function(callback) { getCompanyTop5ProductsChart(type, index, id, callback) }
	}, function(err, result) {
		console.log('### Async calls result: ' + JSON.stringify(result));
		res.send(result);
	});
}

function getCompanyDatas(type, index, id, callback) {
	console.log('#### in getCompanyDatas (type: ' + type + ', index: ' + index  + ' , id: ' + id + ')');
	esclient.search({
		index: index,
		type: type,
		size: 1,
		body: {
			query: {
				term : { id : id }
			}
		}
	}).then(function (response) {
		// Transform ES response to chart
		console.log('### ES response: ' + JSON.stringify(response));
		callback(null, response);
	}, function (error) {
		console.log(error.message);
		callback(error);
	});
}

function getCompanyTop5ProductsChart(type, index, id, callback) {
	console.log('#### in getCompanyDatas (type: ' + type + ', index: ' + index  + ' , id: ' + id + ')');
	esclient.search({
		index: index,
		type: 'order',
		size: 1,
		body: {
			query: {
				term : { id : id }
			},
			facets: {
				tag : {
					terms : {
						field : "productId",
						size : 5
					}
				}
			}
		}
	}).then(function (response) {
		// Transform ES response to chart
		console.log('### ES response: ' + JSON.stringify(response));
		callback(null, response);
	}, function (error) {
		console.log(error.message);
		callback(error);
	});
}

function fromFacetsToChart(facets) {
	// Chart structure
	var chart = {
		title: 'Top 5 produits',
		type: 'pie',
		series: [{
			data: []
		}]
	};

	// terms to serie's datas
	for (var i = 0; i < facets.tag.terms.length; i++) {
		var obj = facets.tag.terms[i];
		chart.series[0].data.push({'name': obj.term, 'y': obj.count});
	};

	return chart;
}
