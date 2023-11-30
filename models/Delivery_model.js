const mongoose = require("mongoose")

const deliverySchema = new mongoose.Schema({
    deliveryName : {
        type : String,
        required : true
    },
    deliveryID :{
        type:String,
        unique : true,
        required : true
    },
    deliveryPassword : {
        type : String,
        required : true
    },
    deliveryAddress : {
        type : String,
        required : true
    },
    deliveryContactNo : {
        type : String,
        required : true
    },
    deliveryCurrentOrders : [{
        deliveryID : String,
        itemID : String
    }], 
    deliveryPreviousOrders : [{
        deliveryID : String,
        itemID : String
    }],
    foodItems : [itemSchema]
})

const delivery = mongoose.model('delivery',deliverySchema)

module.exports = delivery