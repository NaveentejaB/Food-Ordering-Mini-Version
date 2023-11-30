const {customerLogin,customerSignUp,customerPrevOrders,customerCurOrders,editCustomerDetails,
    placeOrder,getAllhotels,getAllItemInHotel,getSpecificHotel} = require("../controllers/customer/customer")
const {auth, checkRole} = require("../middleware/auth")
const express = require("express")

const customerRouter = express.Router()

customerRouter.post("/login",customerLogin)

customerRouter.post("/signup",customerSignUp)

customerRouter.put("/:customerID/edit/info",auth,checkRole("user"),editCustomerDetails)

customerRouter.get("/:customerID/hotels",auth,checkRole("user"),getAllhotels)

customerRouter.get("/:customerID/hotel/:hotelID/items",auth,checkRole("user"),getAllItemInHotel)

customerRouter.get("/:customerID/hotel/:hotelID",auth,checkRole("user"),getSpecificHotel)

customerRouter.get("/:customerID/previousOrders",auth,checkRole("user"),customerPrevOrders)

customerRouter.get("/:customerID/currentOrders",auth,checkRole("user"),customerCurOrders)

customerRouter.get("/:customerID/hotel/:hotelID/item/:itemID",auth,checkRole("user"),placeOrder)

module.exports = customerRouter