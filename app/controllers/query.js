var async = require("async"),
    mongo = require('mongojs');


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
        customerDatas: function(callback) { getCustomerDatas(collection, db, id, callback) },
        customerTop5Chart: function(callback) { getCustomerTop5ProductsChart(collection, db, id, callback) },
        customerCateroyOrderChart: function(callback) { getCustomerCateroyOrderChart(collection, db, id, callback) },
        customerHistoryOrderChart: function(callback) { getCustomerHistoryOrderChart(collection, db, id, callback) }

    }, function(err, result) {
        console.log('### Async calls result: ' + JSON.stringify(result));
        res.send(result);
    });
}

function getCustomerDatas(collection, db, id, callback) {
    console.log('### in getCustomerDatas (collection: ' + collection + ', db: ' + db  + ' , id: ' + id + ')');

    var mdb = mongo('127.0.0.1:27017/'+db, ['customer']);

    var customerId = parseInt(id)
    mdb.customer.find(
        {customerId: customerId},
        function(err, docs) {
            if (err) {
                console.log('/!\\ ' + err.message);
                callback(err);
            } else {
                callback(null, docs);
            }
    });
}

function getCustomerTop5ProductsChart(collection, db, id, callback) {
    console.log('### in getCustomerTop5ProductsChart (collection: ' + collection + ', db: ' + db  + ' , id: ' + id + ')');

    var mdb = mongo('127.0.0.1:27017/'+db, ['customer']);

    var customerId = parseInt(id)
    mdb.customer.aggregate(
        {$match : { customerId : customerId } },
        {$unwind: '$orders'},
        {$group: {
            _id : "$orders.orderType",
            torder : {$sum : "$orders.orderTotal"}
        } },
        {$sort: {"torder":-1}},
        function(err, docs) {
            if (err) {
                console.log('/!\\ ' + err.message);
                callback(err);
            } else {
                callback(null, fromFacetsToChart(docs));
            }
        }
    );

}

function getCustomerCateroyOrderChart(collection, db, id, callback) {
    console.log('### in getCustomerCateroyOrderChart (collection: ' + collection + ', db: ' + db  + ' , id: ' + id + ')');

    var mdb = mongo('127.0.0.1:27017/'+db, ['customer']);

    var customerId = parseInt(id)
    mdb.customer.aggregate(
        {$match : { customerId : customerId } },
        {$unwind: '$orders'},
        {$group: {
            _id : "$orders.orderType",
            sumOrder : {$sum : "$orders.orderTotal"},
            minOrder : {$min : "$orders.orderTotal"},
            maxOrder : {$max : "$orders.orderTotal"},
            avgOrder : {$avg : "$orders.orderTotal"}
        } },
        {$sort: {"_id":1}},
        function(err, docs) {
            if (err) {
                console.log('/!\\ ' + err.message);
                callback(err);
            } else {
                callback(null, fromFacetsToChart2(docs));
            }
        }
    );

}

function getCustomerHistoryOrderChart(collection, db, id, callback) {
    console.log('### in getCustomerCateroyOrderChart (collection: ' + collection + ', db: ' + db  + ' , id: ' + id + ')');

    var mdb = mongo('127.0.0.1:27017/'+db, ['customer']);

    var customerId = parseInt(id)
    mdb.customer.aggregate(
        {$match : { customerId : customerId } },
        {$unwind: '$orders'},
        {$group: {
            _id: { year: { $year: "$orders.orderDate" }, month: { $month: "$orders.orderDate" } },
            sumOrder: {$avg : "$orders.orderTotal"} } },
        {$sort: {"_id":1}},
        function(err, docs) {
            if (err) {
                console.log('/!\\ ' + err.message);
                callback(err);
            } else {
                callback(null, fromFacetsToChart3(docs));
            }
        }
    );

}


function fromFacetsToChart(aggregate) {
    // Chart structure
    var chart = {};
    chart.series=[];

    serie = {};
    serie.name = "MAX";
    serie.type = "pie";
    serie.data = [];
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        serie.data.push({'name': obj._id, 'y': obj.torder});
    };
    chart.series.push(serie);

    console.log(JSON.stringify(chart));

    return chart;
}

function fromFacetsToChart2(aggregate) {
    // Chart structure
    var chart = {};
    chart.series=[];
    chart.xAxis = {};

    categories = [];
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        categories.push(obj._id);
    };
    chart.xAxis.categories = categories;

    serie = {};
    serie.name = "MAX";
    serie.type = "bar";
    serie.data = [];
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        serie.data.push(obj.maxOrder);
    };
    chart.series.push(serie);

    serie = {};
    serie.name = "AVG";
    serie.type = "bar";
    serie.data = [];
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        serie.data.push(obj.avgOrder);
    };
    chart.series.push(serie);

    serie = {};
    serie.name = "MIN";
    serie.type = "bar";
    serie.data = [];
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        serie.data.push(obj.minOrder);
    };
    chart.series.push(serie);

    console.log(JSON.stringify(chart));

    return chart;
}

function fromFacetsToChart3(aggregate) {
    // Chart structure
    var chart = {};
    chart.series=[];
    chart.xAxis = {
        type : 'datetime',
        minRange : 24 * 3600 * 1000
    };

    serie = {};
    serie.name = "HISTO";
    serie.type = "area";
    serie.pointInterval = 24 * 3600 * 1000;
    serie.pointStart = Date.UTC(2008, 0, 1);
    serie.data = [];
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        serie.data.push(obj.sumOrder);
    };
    chart.series.push(serie);

    console.log(JSON.stringify(chart));

    return chart;
}