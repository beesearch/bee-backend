var elasticsearch = require('elasticsearch');

// config
var env = process.env.NODE_ENV || 'development',
  config = require('../../config.' + env + '.json');

var client = new elasticsearch.Client({
  host: config.elasticsearch.host,
  log: config.elasticsearch.log
});

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

  client.search({
    index: subsidiary,
    //type: 'customer',
    body: {
      query: {
        fuzzy_like_this: {
          like_text: search
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


exports.topFiveProduct = function(req, res) {
  console.log('### in topFiveProduct');

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
    var hits = response.facets.tag.terms;
    res.send(hits);
  }, function (error) {
    console.log(error.message);
  });  
}



