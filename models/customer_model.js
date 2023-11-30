const mongoose = require("mongoose")


const customerSchema = new mongoose.Schema({
    customerName : {
        type : String,
        required : true
    },
    customerID :{
        type:String,
        unique : true,
        required : true
    },
    customerPassword : {
        type : String,
        required : true
    },
    customerAddress : {
        type : String,
        required : true
    },
    customerContactNo : {
        type : String,
        required : true
    },
    customerCurrentOrders : [{
        hotelID : String,
        itemID : String
    }], 
    customerPreviousOrders : [{
        hotelID : String,
        itemID : String
    }]
})

const Customer = mongoose.model('Customer',customerSchema)

module.exports = Customer