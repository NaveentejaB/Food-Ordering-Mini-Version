const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    itemID : {
        type:String,
        required : true,
        unique: true
    },
    itemName : {
        type : String,
        required : true
    },
    itemPrice : {
        type:Number,
        required: true
    }
})

const hotelSchema = new mongoose.Schema({
    hotelName : {
        type : String,
        required : true
    },
    hotelID :{
        type:String,
        unique : true,
        required : true
    },
    hotelPassword : {
        type : String,
        required : true
    },
    hotelAddress : {
        type : String,
        required : true
    },
    hotelContactNo : {
        type : String,
        required : true
    },
    hotelpendingOrders : [{
        customerID : String,
        itemID : String
    }], 
    hotelPreviousOrders : [{
        customerID : String,
        itemID : String
    }],
    foodItems : [itemSchema]
})

const Hotel = mongoose.model('Hotel',hotelSchema)

module.exports = Hotel