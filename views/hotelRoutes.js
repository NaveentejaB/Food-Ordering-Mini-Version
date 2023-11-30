const {hotelLogin,hotelSignUp,addFoodItem,updateFoodItems,deleteFoodItem,
    getHotelItemsHotel,getAllCurrentOrders,getAllPreviousOrders,editHotelDetails,
    deliveryOrderToCustomer} = require("../controllers/hotel/hotel")
    const {auth, checkRole} = require("../middleware/auth")
const express = require("express")

const hotelRouter = express.Router()

hotelRouter.post("/login",hotelLogin)

hotelRouter.post("/signup",hotelSignUp)

hotelRouter.put("/:hotelID/edit/info",auth,checkRole("merchant"),editHotelDetails)

hotelRouter.post("/:hotelID/add/item",auth,checkRole("merchant"),addFoodItem)

hotelRouter.put("/:hotelID/editItem/:itemID",auth,checkRole("merchant"),updateFoodItems)

hotelRouter.delete("/:hotelID/delete/item/:itemID",auth,checkRole("merchant"),deleteFoodItem)

hotelRouter.get("/:hotelID/items",auth,checkRole("merchant"),getHotelItemsHotel)

hotelRouter.get("/:hotelID/previousOrders",auth,checkRole("merchant"),getAllPreviousOrders)

hotelRouter.get("/:hotelID/currentOrders",auth,checkRole("merchant"),getAllCurrentOrders)

hotelRouter.get("/:hotelID/item/:itemID/:customerID/deliver",auth,checkRole("merchant"),deliveryOrderToCustomer)

module.exports = hotelRouter