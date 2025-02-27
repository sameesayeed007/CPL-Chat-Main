const router = require('express').Router();
// const User = require('../Models/User');
// const Token = require('../Models/Token');
const Message = require('../Models/Message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verify = require('./verifyToken');
const axios = require('axios');
dotenv.config();


router.get('/test/',verify, (req,res) =>{
	// console.log("Node js and socket is running");
    // res.send(socket_id);
    return res.status(200).send('kaaj kortese'); 
    

});


router.post('/saveMessages', async(req,res) =>{

    var currentDateTime = new Date();

    const newObject = new Message({
        userId : req.body.userId,
        content : req.body.content,
        roomId: req.body.roomId,
        username:req.body.username,
        messageId : "",
        isGroup : false,
        isSeen : false,
        isDeleted: false,
        isUnsent: false,
        isReply: false,
        dateTime: currentDateTime,
        seenDateTime: currentDateTime


    });
  
  
      const savedObject = await newObject.save();
      res.status(200).send({"success":true,"message":"Message has been saved"})
      
   
  });



router.post('/saveReplies', async(req,res) =>{

    var currentDateTime = new Date();

    const newObject = new Message({
        userId : req.body.userId,
        content : req.body.content,
        roomId: req.body.roomId,
        username:req.body.username,
        messageId : req.body.messageId,
        messageContent: req.body.messageContent,
        isGroup : false,
        isSeen : false,
        isDeleted: false,
        isUnsent: false,
        isReply: true,
        dateTime: currentDateTime,
        seenDateTime: currentDateTime


    });
  
  
      const savedObject = await newObject.save();
      res.status(200).send({"success":true,"message":"Message has been saved"})
      
   
  });



router.get('/displayMessages/:roomId/', async(req,res) =>{


    const messages = await Message.find({roomId : req.params.roomId})
    var i = 1
    if (messages.length === 0){
        res.status(200).send({"success":false,"message":"There are no messages to show"})
    }
    else{
    messages.forEach((message) => {
        message.test = "N/A"
        console.log(message)
        console.log(i)
        var username = "N/A"
        var message_content = "N/A"
        user_id = message.userId
        // request_url = process.env.REGISTRATION_MODULE_DOMAIN +"api/user/getUsername/"+user_id+"/"
        
        // const result = axios.get(request_url).then(function (response) {
            
        //     if (response.data.success === false){
        //         console.log("false hochche")
        //         username = "N/A"
        //     }
        //     else{
        //         console.log("true hochche")
        //         username = response.data
        //     }
            
        //   });
        // console.log("username",username)

        // if (message.isReply === true){
        //     //Find the content of the message
        //     console.log("message reply ase")
        //     message_id = message.messageId
        //     request_url_message = process.env.DOMAIN +"api/message/getMessageContent/"+message_id+"/"
           
        //     const message_result = axios.get(request_url_message).then(function (response) {
                
        //         if (response.data.success === false){
        //             console.log("false hochche")
        //             message_content = "N/A"
        //             message["message_content"] = message_content
        //         }
        //         else{
        //             console.log("true hochche")
        //             message_content = response.message_content
        //             message["message_content"] = message_content
        //         }
                
        //       });
        //       console.log("message_content",message_content)

        // }
        // else{
        //     message["message_content"] = "N/A"
        // }
        


        i = i+1;

    })
    res.status(200).send({"success":true,"message":"Messages are shown","data":messages})
}
   
  });


router.get('/getMessageContent/:messageId/', async (req,res) =>{
    const specificMessage = await Message.findById(req.params.messageId);
    if (!specificMessage){
        return res.status(200).send({"success":false,"message":"Message does not exist"});
    }
    else{
        message_content = specificMessage.content

        res.status(200).send({"success":true,"message_content":message_content});

        }
});



router.get('/deleteMessage/:messageId/', async (req,res) =>{
    const specificMessage = await Message.findById(req.params.messageId);
    if (!specificMessage){
        return res.status(200).send({"success":false,"message":"Message does not exist"});
    }
    else{
        const updatedMessage = {'isDeleted': true}
        await specificMessage.updateOne({ $set: updatedMessage });

        res.status(200).send({"success":true,"message":"Message has been updated"});

        }
});

module.exports = router 

