var elasticsearch = require('elasticsearch');

// config
var env = process.env.NODE_ENV || 'development',
  config = require('../../config.' + env + '.json');

var client = new elasticsearch.Client({
  host: config.elasticsearch.host,
  log: 'trace'
});

exports.search = function(req, res) {
  console.log('### in search');

  var search = req.query.search;
  console.log('#### search: ' + search);

  client.search({
    q: search
  }).then(function (body) {
    var hits = body.hits.hits;
    console.log(hits);
    res.send(hits);
  }, function (error) {
    console.log(error.message);
  });
}
