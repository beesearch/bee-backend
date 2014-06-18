var elasticsearch = require('elasticsearch');

// config
var env = process.env.NODE_ENV || 'development',
  config = require('../../config.' + env + '.json');

var client = new elasticsearch.Client({
  host: config.elasticsearch.host,
  log: config.elasticsearch.log
});

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
	client.search({
		index: 'qn',
		size: 1,
		body: {
			"query" : {
				"match_all" : {}
			},

			"facets" : {
				"tag" : {
					"terms" : { "field" : "name", "size" : 5  }
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
