const Customer = require("../../models/customer_model")
const Hotel = require("../../models/hotel_model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// register
const customerSignUp = async(req,res) =>{
	try {
        const {customerName,customerID,customerPassword,customerAddress,customerContactNo} = req.body
		const customer = await Customer.findOne({ customerName: customerName })
		if (customer)
			return res.status(400).json({ 
				redirectUrl: "/customer/signup",
                success: true, 
                message: "customer with given name already exist" 
            })

		const salt = await bcrypt.genSalt(Number(process.env.SALT))
		const hashPassword = await bcrypt.hash(customerPassword, salt)

		await new Customer({ ...req.body, customerPassword: hashPassword }).save()
		res.status(201).json({ 
			// redirectUrl : "/admin/:"+req.body.adminName+"/pending/tasks",
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
const customerLogin = async(req,res) =>{
	try {
		const customer = await Customer.findOne({ customerName: req.body.customerName })
		if (!customer)
			return res.status(401).json({ 
				redirectUrl: "/customer/login",
                success: true, 
                message: "Invalid customerName or password" 
            })

		const verifiedPassword = await bcrypt.compare(
			req.body.customerPassword,
			customer.customerPassword
		)
		if (!verifiedPassword)
			return res.status(401).json({ 
				redirectUrl: "/customer/login",
                success: false, 
                message: "Invalid admin name or password" 
            })
		
		const payload = { id:customer._id , role :"user"}

		const accessToken = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_PRIVATE_KEY,
			{ expiresIn: "30m" }
		)	

		res.status(200).json({
			redirectUrl : "/:"+customer.customerID+"/hotels",
			accessToken,
			success: true,
			message: "Logged in sucessfully",
		})

	} catch (err) {
		console.log(err)
		res.status(500).json({
			redirectUrl: "/customer/login", 
            success: false, 
            message: "Internal Server success" 
        })
	}
}


// get all the hotels
const getAllhotels = async(req,res) =>{
    try{
        const hotels = await Hotel.find()
        res.status(200).json({
            hotels,
            message : 'fetched all the hotels successfully',
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// fetch all the items in the given hotel
const getAllItemInHotel = async(req,res) =>{
    try{
        const {hotelID,customerID} = req.params
        const hotel = await Hotel.findOneAndUpdate({hotelID:hotelID})
        const foodItems = hotel.foodItems
        res.status(200).json({
            foodItems,
            message : `food items from the hotel with ID ${hotelID} fetched.`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// get specific hotel
const getSpecificHotel = async(req,res) =>{
    try{
        const {hotelID,customerID} = req.params
        const hotel = await Hotel.findOne({hotelID:hotelID})
        res.status(200).json({
            hotel,
            message : `Details of the hotel with ID ${hotelID} fetched.`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// place the order
const placeOrder = async(req,res) =>{
    try{
        const {customerID,hotelID,itemID} = req.params
        // update customer
        const customer = await Customer.findOne({customerID:customerID})
        const curOrders = customer.customerCurrentOrders
        const order = {
            hotelID,
            itemID
        }
        curOrders.push(order)
        console.log(curOrders);
        const updateCustomer = await Customer.findOneAndUpdate({customerID:customerID},{customerCurrentOrders:curOrders})
        // update the hotel
        const hotel = await Hotel.findOne({hotelID:hotelID})
        const hotelCurOrders = hotel.hotelpendingOrders
        const hotelOrder = {
            customerID,
            itemID
        }
        hotelCurOrders.push(hotelOrder)
        console.log(hotelCurOrders);
        const updateHotel = await Hotel.findOneAndUpdate({hotelID:hotelID},{hotelpendingOrders:hotelCurOrders})
        res.status(200).json({
            message : `Order placed. It will be delivered as soon as possible. Thank you.`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// fetches all the previous orders of the customer
const customerPrevOrders = async(req,res) =>{
    try{
        const customerID = req.params.customerID
        const customer = await Customer.findOne({customerID:customerID})
        const customerPreviousOrders = customer.customerPreviousOrders
        res.status(200).json({
            customerPreviousOrders,
            message : `fetched the previous order history for the customer with ID ${customerID}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

// fetches all the current orders of the customer
const customerCurOrders = async(req,res) =>{
    try{
        const customerID = req.params.customerID
        const customer = await Customer.findOne({customerID:customerID})
        const customerCurrentOrders = customer.customerCurrentOrders
        res.status(200).json({
            customerCurrentOrders,
            message : `fetched the pending order history for the customer with ID ${customerID}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}

//edit the details of the customer
const editCustomerDetails = async(req,res) =>{
    try{
        const {customerAddress,customerContactNo} = req.body
        const customerID = req.params.customerID
        const update = {
            customerAddress,
            customerContactNo
        }
        const updateCust = await Customer.findOneAndUpdate({customerID:customerID},update)
        res.status(200).json({
            message : `updated details of the customer with ID=${customerID}`,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}


module.exports = {customerLogin,customerSignUp,placeOrder,editCustomerDetails,
    getAllhotels,getAllItemInHotel,getSpecificHotel,customerPrevOrders,customerCurOrders}


// const addFoodItems = async(req,res) =>{
//     try{

//     }catch(err){
//         res.status(500).json({
//             message : err.message,
//             success : false
//         })
//     }
// }