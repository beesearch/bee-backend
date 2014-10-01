var async = require("async");

// Mongo client
var mdb = require('../../server').mdbclient;

exports.testQuery = function(req, res) {
    console.log('### in getQuery (collection: ' + req.param("collection") + ', db: ' + req.param("db")  + ' , id: ' + req.param("id") + ')');

    var collection = req.param("collection");
    var db = req.param("db");
    var id = req.param("id");

    var result;
    if (collection === 'customer') {
        result = getCustomer(collection, db, id, res);
    } else {
        res.send('type not found');
    }

    console.log('### out getQuery');
}

function getCustomer(collection, db, id, res) {
    console.log('### in getCustomer (collection: ' + collection + ', db: ' + db  + ' , id: ' + id + ')');
    // Parallel calls
    async.parallel({
        customerDatas: function(callback) { getCustomerDatas(collection, db, id, callback) }//,
        //customerTop5Chart: function(callback) { getCustomerTop5ProductsChart(collection, db, id, callback) }

    }, function(err, result) {
        console.log('### Async calls result: ' + JSON.stringify(result));
        res.send(result);
    });
}

function getCustomerDatas(collection, db, id, callback) {
    console.log('### in getCustomerDatas (collection: ' + collection + ', db: ' + db  + ' , id: ' + id + ')');
    var i = parseInt(id)
    mdb.customer.find({customerId: i}, function(err, docs) {
        callback(null, docs);
    });
}


function getCustomerTop5ProductsChart(collection, db, id, callback) {
    console.log('### in getCustomerTop5ProductsChart (collection: ' + collection + ', db: ' + db  + ' , id: ' + id + ')');
    mdb.customer.aggregate({ $group :
        { _id : {customerId: "$customerId", name:"$name", toto:"test"},
            myTotal : { $sum : "$total" }
        }},
        { $match : {'myTotal' : { $gte : 2000 } } },
        function(err, docs) {
        callback(null, docs);
    });
}