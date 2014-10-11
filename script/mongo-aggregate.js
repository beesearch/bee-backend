db.customer.aggregate( 
        {$match : { customerId : 10771 } },
        {$unwind: '$orders'},
        {$group: {
            _id: { year: { $year: "$orders.orderDate" }, month: { $month: "$orders.orderDate" } },
            sumOrder: {$avg : "$orders.orderTotal"} } },
        {$sort: {"_id":1}},
        {$limit: 100}
)
        
db.customer.aggregate(         
        {$match : { customerId : 10771 } },
        {$unwind: '$orders'},
        {$group: {
            _id : "$orders.orderType",
            torder : {$sum : "$orders.orderTotal"}
        } },
        {$sort: {"_id":1}}
)
        
db.customer.aggregate(         
        {$match : { customerId : customerId } },
        {$unwind: '$orders'},
        {$group: {
            _id : "$orders.orderType",
            sumOrder : {$sum : "$orders.orderTotal"},
            minOrder : {$min : "$orders.orderTotal"},
            maxOrder : {$max : "$orders.orderTotal"},
            avgOrder : {$avg : "$orders.orderTotal"}
        } },
        {$sort: {"_id":1}}
)