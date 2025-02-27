
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const axios = require('axios');
const { render } = require('ejs');
const cors = require('cors');
//create a server 
const server = require('http').Server(app)
const messageRoute = require('./Routes/message');
const port = process.env.PORT || 3000

app.set('views','./views');

app.set('view engine', 'ejs');

//for the static folders 
app.use(express.static('public'))

//for urls 
app.use(express.urlencoded({extended:true}))
app.use(express.json()); //Used to parse data provided during POST requests 
app.use(helmet({contentSecurityPolicy: false}));
app.use(cors());


const io = require('socket.io')(server,{cors: {origin: "*",}})

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () =>{
	console.log("Connection to monngodb is made");
})

app.use("/api/message/", messageRoute);


app.get('/', (req,res) =>{
	// console.log("Node js and socket is running");
    // res.send(socket_id);
    res.render('index');

});

io.on('connection', (socket) => {
	console.log("Inside the socket")
	console.log(socket.id)


	//This is a response to an emit from the client side when a new user has joined the chat or has become online
	//The client has to send the userid and the room name
	// socket.on('new-user', (room,name) =>{
	// 	socket.join(room)
	// 	//Letting all the others in that room know that this user has joined 
	// 	//The client side can put a message that shows the user has come online and change the online status
	// 	//The server also has to change the online-offline status using an API
	// 	socket.broadcast.to(room).emit('user-connected', name)
	//   })



	//This is a response to an emit from the client side when a user has pressed the sent button or created a new message
	//The client has to send the userid,roomId and the message
	socket.on('send-chat-message', (message,username,userId,usernameTwo,userIdTwo,roomId) =>{
		// console.log("room")
		// console.log(roomId)
		socket.join(roomId)
		
		//the server than lets all the others in the room about this message and also who has sent the message
		// The client side will need to receive this and show the message in the specific chatbox and append the message as a normal message
		// socket.broadcast.emit('show-chat-message',{message:message})
		socket.broadcast.to(roomId).emit('show-chat-message',{message : message, userId: userId,username: username})
	  
	  })

	//This is a response to an emit from the client side when a user has replied to a specific message 
	//The client side has to send the userId,roomId,message,messageId(the message to which the reply is made)
	socket.on('send-chat-message-reply', (room,message,username,messageId) =>{
		//the server than lets all the others in the room about this message and also who has sent the message
		// The client side will need to receive this and show the message in the specific chatbox and append the message as a reply to that specific message
		socket.broadcast.to(room).emit('chat-message-reply',{message : message, name: username,messageId:messageId})
	  
	  })


	//This is a response to an emit from the client side when a user has deleted a message
	//The client side has to send the userId,roomId,message,messageId(the message to which the reply is made)
	socket.on('delete-message', (room,username,messageId) =>{
		//the server than lets all the others in the room about this message and also who has sent the message
		// The client side will need to receive this and show the message in the specific chatbox and append the message as a reply to that specific message
		socket.broadcast.to(room).emit('chat-message-delete',{name: username,messageId:messageId})
	  
	  })


	
	
});

server.listen(port);