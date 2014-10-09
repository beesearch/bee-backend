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
        customerHistorySales: function(callback) { getCustomerHistoryChart(collection, db, id, callback) }

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

    mdb.customer.aggregate(
        {$unwind: '$orders'},
        {$group: {
            _id : "$orders.orderType",
            torder : {$sum : "$orders.orderTotal"}
        } },
        {$limit: 40},
        {$sort: {"_id":1}},
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

function getCustomerHistoryChart(collection, db, id, callback) {
    console.log('### in getCustomerHistoryChart (collection: ' + collection + ', db: ' + db  + ' , id: ' + id + ')');

    var mdb = mongo('127.0.0.1:27017/'+db, ['customer']);

    mdb.customer.aggregate(
        {$unwind: '$orders'},
        {$group: {
            _id : "$orders.orderType",
            sumOrder : {$sum : "$orders.orderTotal"},
            minOrder : {$min : "$orders.orderTotal"},
            maxOrder : {$max : "$orders.orderTotal"},
            avgOrder : {$avg : "$orders.orderTotal"}
        } },
        {$limit: 40},
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

function fromFacetsToChart(aggregate) {
    // Chart structure
    var chart = {
        series: [{ data: []}]
    };

    // terms to serie's datas
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        chart.series[0].data.push({'name': obj._id, 'y': obj.torder});
    };

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
        //categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
    };
    chart.xAxis.categories = categories;

    serie = {};
    serie.name = "SUM";
    serie.data = [];
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        serie.data.push(obj.sumOrder);
        //serie.data = [0,1,2,3];
    };
    chart.series.push(serie);

    serie = {};
    serie.name = "MAX";
    serie.data = [];
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        serie.data.push(obj.maxOrder);
        //serie.data = [0,1,2,3];
    };
    chart.series.push(serie);

    serie = {};
    serie.name = "AVG";
    serie.id = "cdjwxbcn";
    serie.data = [];
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        serie.data.push(obj.avgOrder);
        //serie.data = [0,1,2,3];
    };
    chart.series.push(serie);


    line = {};
    line.name = "MIN";
    line.data = [];
    for (var i = 0; i < aggregate.length; i++) {
        var obj = aggregate[i];
        line.data.push(obj.minOrder);
        //serie.data = [0,1,2,3];
    };
    chart.series.push(line);

    console.log(JSON.stringify(chart));

    return chart;
}