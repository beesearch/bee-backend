var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
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
    console.trace(error.message);
  });
}

exports.data = function(req, res) {
  res.send({'type': 'Hello', 'now': new Date().toJSON()});
}
