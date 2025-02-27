const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
// const notificationsRoute = require('./Routes/notifications');
// const requestsRoute = require('./Routes/requests');
// const groupRoute = require('./Routes/group');
// const OnetoOneRoute = require('./Routes/onetooneroom');
const cors = require('cors');
// const tokenRoute = require('./Routes/token');
// const userRoute = require('./Routes/user');
const port = process.env.PORT || 5000

dotenv.config();
app.use(cors());


try {
	mongoose.connect(process.env.MONGO_URL , { useNewUrlParser: true, useUnifiedTopology: true }, () =>{
		console.log("Connection to monngodb atlas is made");
	})
	
} catch (error) {
	console.log("error")
}


//middlewares
app.use(express.json()); //Used to parse data provided during POST requests 
app.use(helmet());

// app.use("/api/notifications/", notificationsRoute);
// app.use("/api/requests/", requestsRoute);
// app.use("/api/group/", groupRoute);
// app.use("/api/room/", OnetoOneRoute);





app.listen(port, ()=>{
	console.log("Backend server is running");
});