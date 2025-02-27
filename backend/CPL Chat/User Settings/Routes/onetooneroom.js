const router = require('express').Router();
// const User = require('../Models/User');
// const Token = require('../Models/Token');
const Group = require('../Models/Group');
const Profile = require('../Models/Profile');
const OnetoOneRoom = require('../Models/OnetoOneRoom');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verify = require('./verifyToken');
const axios = require('axios');
dotenv.config();


router.post('/createOnetoOneRoom', async(req,res) =>{
    let userIdOne = req.body.userIdOne
    let usernameOne = req.body.usernameOne
    let userIdTwo = req.body.userIdTwo
    let usernameTwo = req.body.usernameTwo


    const specificRoom = await OnetoOneRoom.findOne({userIdOne: userIdOne, usernameOne:usernameOne, userIdTwo:userIdTwo, usernameTwo:usernameTwo,isDeleted: false});

    if (specificRoom){
        res.status(200).send({"success":true,"message":"Room data is shown","data":specificRoom})


    }

    else{
        //Look for the alternative 
        const alternativeSpecificRoom = await OnetoOneRoom.findOne({userIdOne: userIdTwo, usernameOne:usernameTwo, userIdTwo:userIdOne, usernameTwo:usernameOne,isDeleted: false});

        if (alternativeSpecificRoom){
            res.status(200).send({"success":true,"message":"Room data is shown","data":alternativeSpecificRoom})

        }
        else{
            //Create a new room 
            const room = new OnetoOneRoom({
                userIdOne: req.body.userIdOne,
                usernameOne : req.body.usernameOne,
                userIdTwo: req.body.userIdTwo,
                usernameTwo : req.body.usernameTwo,
        
            });

            const savedObject = await room.save();
            res.status(200).send({"success":true,"message":"Room has been created","data":savedObject})

        }

    }
      
   
  });











module.exports = router 