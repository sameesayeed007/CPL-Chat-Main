const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const authRoute = require('./Routes/auth');
const tokenRoute = require('./Routes/token');
const userRoute = require('./Routes/user');
const { render } = require('ejs');
const cors = require('cors');
const port = process.env.PORT || 7000


dotenv.config();

app.set('views','./views');

app.set('view engine', 'ejs');

//for the static folders 
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json());
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

app.use("/api/auth/", authRoute);
app.use("/api/token/", tokenRoute);
app.use("/api/user/", userRoute);




app.listen(port, ()=>{
	console.log("Backend server is running");
});