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
	console.log('#### in getCompany (type: ' + type + ', index: ' + index  + ' , id: ' + id + ')');
	// Parallel calls
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
				term : { "customer.company.id" : id }
			}
		}
	}).then(function (response) {
		// Callback with datas
		callback(null, response.hits.hits[0]);
	}, function (error) {
		console.log(error.message);
		callback(error);
	});
}


function getCompanyTop5ProductsChart(type, index, id, callback) {
	console.log('#### in getCompanyTop5ProductsChart (type: ' + type + ', index: ' + index  + ' , id: ' + id + ')');
	esclient.search({
		index: index,
		type: 'customer',
		size: 0,
		body: {
			query: {
				term : { "customer.companyId" : id }
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
		// response = {"took":3,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":100,"max_score":0,"hits":[]},"facets":{"terms":{"_type":"terms_stats","missing":0,"terms":[{"term":"boulon","count":832,"total_count":832,"min":100,"max":400,"total":212900,"mean":255.88942307692307},{"term":"ecrou","count":819,"total_count":819,"min":100,"max":400,"total":199100,"mean":243.1013431013431},{"term":"vis","count":776,"total_count":776,"min":100,"max":400,"total":196400,"mean":253.09278350515464},{"term":"joint","count":414,"total_count":414,"min":100,"max":400,"total":106100,"mean":256.280193236715},{"term":"rondelle","count":402,"total_count":402,"min":100,"max":400,"total":103900,"mean":258.4577114427861},{"term":"split","count":401,"total_count":401,"min":100,"max":400,"total":101500,"mean":253.11720698254365}]}}};
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
		type: 'pie',
		series: [{ data: [], name: 'Total' }]
	};

	// terms to serie's datas
	for (var i = 0; i < facets.terms.terms.length; i++) {
		var obj = facets.terms.terms[i];
		chart.series[0].data.push({'name': obj.term, 'y': obj.count});
	};

	return chart;
}
