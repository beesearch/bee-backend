// ElasticSearch client
var esclient = require('../../server').esclient;

exports.companySearch = function(req, res) {
  console.log('### in companySearch');

  var subsidiary = req.query.subsidiary
  var search = req.query.search;
  console.log('#### subsidiary: ' + req.query.subsidiary);
  console.log('#### search: ' + req.query.search);

  esclient.search({
    index: subsidiary,
    //type: 'customer',
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
