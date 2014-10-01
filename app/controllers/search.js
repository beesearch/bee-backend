// ElasticSearch client
var esclient = require('../../server').esclient;

exports.companySearch = function(req, res) {

  var indexes = req.query.indexes;
  var types = req.query.types;
  var search = req.query.search;
  console.log('### in companySearch (type: ' + types + ', index: ' + indexes  + ' , search: ' + search + ')');

  esclient.search({
    index: indexes,
    type: types,
    body: 
    {
      "fields" : ["company.name", "company.siren"],
      "query": {
        "match_phrase_prefix": {
          "company.name": {
            "query": search,
            "max_expansions": 5
          }
        }
      }
    }
  }).then(function (body) {
    var hits = body.hits.hits;
    res.send(hits);
  }, function (error) {
    console.log(error.message);
  });  
}
