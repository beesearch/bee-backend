var async = require("async");

// Mongo client
var db = require('../../server').mdbclient;

exports.testQuery = function(req, res) {
    console.log('### in getQuery (collection: ' + req.param("collection") + ', index: ' + req.param("index")  + ' , id: ' + req.param("id") + ')');

    var collection = req.param("collection");
    var index = req.param("index");
    var id = req.param("id");

    var result;
    if (collection === 'customer') {
        result = getCustomer(collection, index, id, res);
    } else {
        res.send('type not found');
    }

    console.log('### out getQuery');
}

function getCustomer(collection, index, id, res) {
    console.log('#### in getCompany (collection: ' + collection + ', index: ' + index  + ' , id: ' + id + ')');
    // Parallel calls
    async.parallel({
        customerDatas: function(callback) { getCustomerDatas(collection, index, id, callback) }

    }, function(err, result) {
        console.log('### Async calls result: ' + JSON.stringify(result));
        res.send(result);
    });
}

function getCustomerDatas(collection, index, id, callback) {
    console.log('#### in getCompanyDatas (collection: ' + collection + ', index: ' + index  + ' , id: ' + id + ')');
    console.log('### in testQuery');
    db.customer.find(function(err, docs) {
        callback(null, docs);
    });
}