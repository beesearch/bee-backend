db.customer.aggregate( 
    {$unwind: '$orders'}, 
    {$group: { 
        _id: { year: { $year: "$orders.orderDate" }, month: { $month: "$orders.orderDate" } }, 
        sumOrder: {$avg : "$orders.orderTotal"} } }, 
    {$sort: {"_id":1}} 
)