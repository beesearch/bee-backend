var elasticsearch = require('elasticsearch');

// config
var env = process.env.NODE_ENV || 'development',
  config = require('../../config.' + env + '.json');

var client = new elasticsearch.Client({
  host: config.elasticsearch.host,
  log: config.elasticsearch.log
});


// Recherche dans les noms et prenoms des customers avec approximation
//
//    Params :
//    * subsidiary = le nom de la filiale (qn, snrf, fta)
//    * search = le text a rechercher 
//
exports.customerFuzzySearch = function(req, res) {
  console.log('### in customerFuzzySearch');

  var subsidiary = req.query.subsidiary
  var search = req.query.search;
  console.log('#### search: ' + req.query.subsidiary);

  client.search({
    index: subsidiary,
    type: 'customer',
    body: {
      query: {
        fuzzy_like_this: {
          like_text: search,
          fields: ["firstName", "lastName"]
        }
      }
    }
  }).then(function (body) {
    var hits = body.hits.hits;
    //console.log(hits);
    res.send(hits);
  }, function (error) {
    console.log(error.message);
  });  
}