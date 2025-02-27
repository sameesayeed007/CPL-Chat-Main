const router = require('express').Router();
// const User = require('../Models/User');
// const Token = require('../Models/Token');
const Notification = require('../Models/Notification');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verify = require('./verifyToken');
const axios = require('axios');
dotenv.config();
var cors = require('cors')
router.use(cors())





//Creates a notification on sending a message
router.post('/createNotification', async(req,res) =>{

    

    const notification = new Notification({
        userId : req.body.userId,
        username : req.body.username,
        fullName : "",
        profilePhoto : "",
        address : "",
        phoneNumber : "",



    });
  
  
      const savedObject = await notification.save();
     
      res.status(200).send({"success":true,"message":"Notification has been created"})
      
   
  });













module.exports = router 

