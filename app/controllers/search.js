// ElasticSearch client
var esclient = require('../../server').esclient;

// Recherche dans tout
//
//    Params :
//    * subsidiary = le nom de la filiale (qn, snrf, fta)
//    * search = le texte à rechercher
//
exports.fuzzySearch = function(req, res) {
  console.log('### in fuzzySearch');

  var subsidiary = req.query.subsidiary
  var search = req.query.search;
  console.log('#### subsidiary: ' + req.query.subsidiary);
  console.log('#### search: ' + req.query.search);

  esclient.search({
    index: subsidiary,
    //type: 'customer',
    body: 
    {
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
