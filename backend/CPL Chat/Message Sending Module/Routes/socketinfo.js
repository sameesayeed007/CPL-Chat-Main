const router = require('express').Router();
// const User = require('../Models/User');
// const Token = require('../Models/Token');
const SocketInfo = require('../Models/SocketInfo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verify = require('./verifyToken')
dotenv.config();


router.post('/saveSocketInfo/',(req,res) =>{
	// console.log("Node js and socket is running");
    // res.send(socket_id);
                //User object
        const socketInfo =  await new SocketInfo({
            userId : req.body.userId,
            socketId : req.body.socketId,
            isValid: true
        });
        
        const new_socket_info = await socketInfo.save();
        return res.status(200).send({'success':true,'message':"Socket Info has been saved"}); 
    

});

module.exports = router 