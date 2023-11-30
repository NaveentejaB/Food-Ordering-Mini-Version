const Hotel = require("../../models/hotel_model")
const Customer = require("../../models/customer_model")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")



// register
const hotelSignUp = async(req,res) =>{
	try {
        const {hotelName,hotelID,hotelPassword,hotelAddress,hotelContactNo} = req.body
		const hotel = await Hotel.findOne({ HotelName: hotelName })
		if (hotel)
			return res.status(400).json({ 
				redirectUrl: "/hotel/signup",
                success: false, 
                message: "hotel with given name already exist" 
            })

		const salt = await bcrypt.genSalt(Number(process.env.SALT))
		const hashPassword = await bcrypt.hash(hotelPassword, salt)

		await new Hotel({ ...req.body, hotelPassword: hashPassword }).save()
		res.status(201).json({ 
            success: true, 
            message: "Account created sucessfully" 
        })
	} catch (err) {
		console.log(err)
		res.status(500).json({ 
            success: false, 
            message: "Internal Server success" 
        })
	}
}
//login
const hotelLogin = async(req,res) =>{
	try {
		const hotel = await Hotel.findOne({ hotelName: req.body.hotelName })
		if (!hotel)
			return res.status(401).json({ 
				redirectUrl: "/hotel/login",
                success: true, 
                message: "Invalid hotelName or password" 
            })

		const verifiedPassword = await bcrypt.compare(
			req.body.hotelPassword,
			hotel.hotelPassword
		)
		if (!verifiedPassword)
			return res.status(401).json({ 
				redirectUrl: "/hotel/login",
                success: false, 
                message: "Invalid admin name or password" 
            })
		
		const payload = { id:hotel._id , role :"merchant"}

		const accessToken = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_PRIVATE_KEY,
			{ expiresIn: "30m" }
		)	

		res.status(200).json({
			redirectUrl : "/:"+hotel.hotelID+"/items",
			accessToken,
			success: true,
			message: "Logged in sucessfully",
		})

	} catch (err) {
		console.log(err)
		res.status(500).json({
			redirectUrl: "/hotel/login", 
            success: false, 
            message: "Internal Server success" 
        })
	}
}


// add item
const addFoodItem = async(req,res) =>{
    try{
        const {hotelID} = req.params
        const {itemID,itemName,itemPrice} = req.body
        const hotel = await Hotel.findOne({hotelID:hotelID})
        console.log(hotel);
        const items = hotel.foodItems
        const newItem = {
            itemID,
            itemName,
            itemPrice
        }
        items.push(newItem)
        const updatehotel = await Hotel.findOneAndUpdate({hotelID:hotelID},{foodItems:items})
        res.status(200).json({
            message : `added the food item with ID ${itemID}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

const updateFoodItems = async(req,res) =>{
    try{
        const hotelID = req.params.hotelID
        const itemID = req.params.itemID
        const {itemName,itemPrice} = req.body
        const hotel = await Hotel.findOne({hotelID:hotelID})
        const items = hotel.foodItems
        const index = items.findIndex(object => {
            return object.itemID === itemID;
          });
        var item = items[index]  
        console.log(item);
        item.taskName = itemName
        item.itemPrice = itemPrice
        const updatehotel = await Hotel.findOneAndUpdate({hotelID:hotelID},{foodItems:items})
        res.status(500).json({
            message : `Item with ID ${itemID} has been updated.`,
            success : false
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }

}

// get all items in the hotel for merchant
const getHotelItemsHotel = async(req,res) =>{
    try{
        const hotelID = req.params.hotelID
        const hotel = await Hotel.findOne({hotelID:hotelID})
        const foodItems = hotel.foodItems
        res.status(200).json({
            foodItems,
            message : 'fetched all food items in the hotel',
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// get all items in the hotel for merchant
const deleteFoodItem = async(req,res) =>{
    try{
        const {hotelID,itemID} = req.params
        const hotel = await Hotel.findOne({hotelID:hotelID})
        const items = hotel.foodItems
        console.log(items);
        const index = items.findIndex(object => {
            return object.itemID === itemID;
          });
        console.log(index);
        if (index > -1) { 
            items.splice(index, 1)
        }
        console.log(items);
        const updateHotel = await Hotel.findOneAndUpdate({hotelID:hotelID},{foodItems:items})
        res.status(200).json({
            message : `food item with ID ${itemID} deleted`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// get all current orders
const getAllCurrentOrders = async(req,res) =>{
    try{
        const hotelID = req.params.hotelID
        const hotel = await Hotel.findOne({hotelID:hotelID})
        const curOrders = hotel.hotelpendingOrders
        res.status(200).json({
            curOrders,
            message :  `Fetched all current orders of hotel ${hotelID}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

//get all previous orders
const getAllPreviousOrders = async(req,res) =>{
    try{
        const hotelID = req.params.hotelID
        const hotel = await Hotel.findOne({hotelID:hotelID})
        const prevOrders = hotel.hotelPreviousOrders
        res.status(200).json({
            prevOrders,
            message :  `Fetched all current orders of hotel ${hotelID}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// delivery the current order
const deliveryOrderToCustomer = async(req,res) =>{
    try{
        const {hotelID,customerID,itemID} = req.params
        //update hotel
        const hotel = await Hotel.findOne({hotelID:hotelID})
        const hotelOrder = {
            itemID,
            customerID
        }
        const curOrders = hotel.hotelpendingOrders
        var index = curOrders.findIndex(object => {
            return ((object.itemID === itemID) && (object.customerID === customerID));
        }) 
        if (index > -1) { 
            curOrders.splice(index, 1)
        }
        console.log(curOrders);
        const prevOrders = hotel.hotelPreviousOrders
        prevOrders.push(hotelOrder)
        console.log(prevOrders);
        const updateHotel = await Hotel.findOneAndUpdate({hotelID:hotelID},{
            hotelpendingOrders : curOrders,
            hotelPreviousOrders : prevOrders
        })
        //update customer
        const customer = await Customer.findOne({customerID:customerID})
        const custOrder = {
            hotelID,
            itemID
        }
        const customerCurOrders = customer.customerCurrentOrders
        index = -1
        index = customerCurOrders.findIndex(object => {
            return ((object.hotelID === hotelID) && (object.itemID === itemID));
        }) 
        
        if (index > -1) { 
            customerCurOrders.splice(index, 1)
        }
        console.log(customerCurOrders);

        const customerPrevOrders = customer.customerPreviousOrders
        customerPrevOrders.push(custOrder)
        console.log(customerPrevOrders);
        const update = {
            customerCurrentOrders : customerCurOrders,
            customerPreviousOrders : customerPrevOrders
        }
        console.log(update);
        const updateCustomer = await Customer.findOneAndUpdate({customerID:customerID},update)
        res.status(200).json({
            message : `the item with ID ${itemID} deliveried to customer with ID ${customerID} from hotel with ID ${hotelID}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

//edit the details of the hotel
const editHotelDetails = async(req,res) =>{
    try{
        const {hotelAddress,hotelContactNo} = req.body
        const hotelID = req.params.hotelID
        const update = {
            hotelAddress,
            hotelContactNo
        }
        const updateHotel = await Hotel.findOneAndUpdate({hotelID:hotelID},update)
        res.status(200).json({
            message : `updated details of the hotel with ID=${hotelID}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

module.exports = {hotelLogin,hotelSignUp,addFoodItem,updateFoodItems,deleteFoodItem,editHotelDetails,
    getHotelItemsHotel,getAllCurrentOrders,getAllPreviousOrders,deliveryOrderToCustomer}