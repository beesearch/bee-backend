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
	console.log('### in getCompany (type: ' + type + ', index: ' + index  + ' , id: ' + id + ')');
	// Parallel calls
	async.parallel({
		companyDatas: function(callback) { getCompanyDatas(type, index, id, callback) },
		companyTop5Chart: function(callback) { getCompanyTop5ProductsChart(type, index, id, callback) },
		companyTop5Sales: function(callback) { getCompanyTop5SalesChart(type, index, id, callback) }

	}, function(err, result) {
		console.log('### Async calls result: ' + JSON.stringify(result));
		res.send(result);
	});
}

function getCompanyDatas(type, index, id, callback) {
	console.log('### in getCompanyDatas (type: ' + type + ', index: ' + index  + ' , id: ' + id + ')');
	esclient.get({
		index: index,
		type: type,
		id: id
	}).then(function (response) {
		// Callback with datas
		callback(null, response);
	}, function (error) {
		console.log(error.message);
		callback(error);
	});
}

function getCompanyTop5ProductsChart(type, index, id, callback) {
	console.log('### in getCompanyTop5ProductsChart (type: ' + type + ', index: ' + index  + ' , id: ' + id + ')');
	esclient.search({
		index: index,
		type: 'customer',
		size: 0,
		body: {
			query: {
				term : { "_id" : id }
			},
			facets: {
			    terms: {
			      terms_stats: {
			        key_field: "productCategory",
			        value_field: "count"
					},
			       nested: "orders"
			    }
			}
		}
	}).then(function (response) {
		// Transform ES response to chart
		var chart = fromFacetsToChart(response.facets);
		// Callback with chart
		callback(null, chart);
	}, function (error) {
		console.log(error.message);
		callback(error);
	});
}

function getCompanyTop5SalesChart(type, index, id, callback) {
	console.log('### in getCompanyTop5SalesChart (type: ' + type + ', index: ' + index  + ' , id: ' + id + ')');
	esclient.search({
		index: index,
		type: 'customer',
		size: 0,
		body: {
			query: {
				term : { "_id" : id }
			},
			facets: {
			    terms: {
			      terms_stats: {
			        key_field: "orderCategory",
			        value_field: "count"
					},
			       nested: "orders"
			    }
			}
		}
	}).then(function (response) {
		// Transform ES response to chart
		var chart = fromFacetsToChart(response.facets);
		// Callback with chart
		callback(null, chart);
	}, function (error) {
		console.log(error.message);
		callback(error);
	});
}

function fromFacetsToChart(facets) {
	// Chart structure
	var chart = {
		title: { text: 'Top 5 produits' },
		// type: 'pie',
		series: [{ data: []}]
	};

	// terms to serie's datas
	for (var i = 0; i < facets.terms.terms.length; i++) {
		var obj = facets.terms.terms[i];
		chart.series[0].data.push({'name': obj.term, 'y': obj.count});
	};

	return chart;
}
