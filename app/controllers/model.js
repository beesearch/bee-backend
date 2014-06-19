// ElasticSearch client
var esclient = require('../../server').esclient;

exports.getModel = function(req, res) {
	console.log('### in getModel (model: ' + req.param("model") + ' , id: ' + req.param("id") + ')');

	var model = req.param("model");
	var id = req.param("id");

	var result;
	if (model === 'company') {
		result = getCompany(id, req, res);
	} else {
		result = 'model not found';
	}

	console.log('### out getModel');
}

function getCompany(id, req, res) {
	esclient.search({
		index: 'qn',
		size: 1,
		body: {
			{
				"query": {
					"term" : { "companyId" : id }
				},
				"facets": {
					"tag" : {
						"terms" : {
							"field" : "productId",
							"size" : 10
						}
					}
				}
			}
		}
	}).then(function (response) {
		// Transform ES response to chart
		console.log('### ES response: ' + response);
		var company = {};
		company.name = 'Fake Cie';
		company.top5chart = fromFacetsToChart(response.facets);
		res.send(company);
	}, function (error) {
		console.log(error.message);
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
