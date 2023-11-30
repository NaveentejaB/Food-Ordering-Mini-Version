require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")


const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());

const port = process.env.PORT || 3000;

// local
mongoose.connect("mongodb://localhost:27017/prepeatDB",{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
})

// MongoDB Connection (Uncomment this and comment above connection to connect to mongoDB atlas)
// try {
//     // MongoDB Connection
//     mongoose.connect(process.env.MONGO_URI_MAIN, {
//         useNewUrlParser: true, 
//         useUnifiedTopology: true,
//         family: 4,
//     }).catch(error => {
//         console.log(error)
//     });

//     const db = mongoose.connection

//     db.on('error', (err) => {
//         console.error('MongoDB connection error:', err);
//         // Log the error or handle it appropriately without stopping the application
//         // For instance, you can choose to log the error and continue the server running
//     });

//     db.once('open', () => {
//         console.log('Connected to MongoDB');
//         // Perform additional actions when the MongoDB connection is successful
//     });
// } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     // Handle the error as needed (logging, custom response, etc.)
// }



const hotelRoutes = require("./views/hotelRoutes")
const customerRoutes = require("./views/customerRoutes")

app.use("/hotel",hotelRoutes)
app.use("/customer",customerRoutes)

//'0.0.0.0', update  like (port,'0.0.0.0',()) if you want mongodb atlas
app.listen(port,()=>{
    console.log(`Server is running on the port ${port}`);
})