const router = require('express').Router();
// const User = require('../Models/User');
// const Token = require('../Models/Token');
const Requests = require('../Models/Requests');

// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verify = require('./verifyToken');
const Profile = require('../Models/Profile');
dotenv.config();


//Show incoming requests
router.get('/showIncomingRequests/:userId/', async (req,res) =>{
    const requests = await Requests.find({userId:req.params.userId,isIncoming:true,isDeleted: false, isRejected:false,isAccepted: false});
    let arr = []
    if (requests.length === 0){
        return res.status(200).send({"success":false,"message":"Requests does not exist"});
    }
    
    else{
        requests.forEach(async(request) => {
            
            
            // const specProfile = await Profile.findOne({userId : request.userIdTwo})
            // console.log(specProfile)
            // if (specProfile){
            //     request.name = specProfile.fullName
            //     console.log(request)
            // }
            request["FullName"]= "Samee"
            console.log(request)
            arr.push(request)

        })
        res.status(200).send({"success":true,"message":"data is shown","data":arr});

        }
});



//Show outgoing requests
router.get('/showOutgoingRequests/:userId/', async (req,res) =>{
    const requests = await Requests.find({userId:req.params.userId,isIncoming:false,isDeleted: false, isRejected:false,isAccepted: false});
    if (requests.length === 0){
        return res.status(200).send({"success":false,"message":"Requests does not exist"});
    }
    else{
        res.status(200).send({"success":true,"message":"data is shown","data":requests});

        }
});


//Delete a request 
router.get('/deleteRequest/:requestId/', async (req,res) =>{
    const specificRequest = await Requests.findById(req.params.requestId);
    if (!specificRequest){
        return res.status(200).send({"success":false,"message":"Request does not exist"});
    }
    else{
        const updatedRequest = {'isDeleted': true}
        await specificRequest.updateOne({ $set: updatedRequest });

        res.status(200).send({"success":true,"message":"Request has been deleted"});

        }
});



router.post('/sendRequest/', async(req,res) =>{

    

    const outgoingRequest = new Requests({
        userId : req.body.userId,
        username : req.body.username,
        userIdTwo : req.body.userIdTwo,
        usernameTwo : req.body.usernameTwo,
        isIncoming : false,



    });


    const incomingRequest = new Requests({
        userId : req.body.userIdTwo,
        username : req.body.usernameTwo,
        userIdTwo : req.body.userId,
        usernameTwo : req.body.username,
        isIncoming : true,



    });
  
  
  
      const new_outgoingRequest = await outgoingRequest.save();
      const new_incomingRequest = await incomingRequest.save();
      res.status(200).send({"success":true,"message":"Request has been sent"})
      
   
  });



//Delete a request 
router.get('/addFriend/:requestId/', async (req,res) =>{
    const specificRequest = await Requests.findById(req.params.requestId);
    if (!specificRequest){
        return res.status(200).send({"success":false,"message":"Request does not exist"});
    }
    else{
        const updatedRequest = {'isAccepted': true}
        await specificRequest.updateOne({ $set: updatedRequest });
        friendId = specificRequest.userIdTwo 
        friendusername = specificRequest.usernameTwo 
        console.log("friendId",friendId)
        console.log("friendusername",friendusername)
        const specificRequestTwo = await Requests.findOne({userId:friendId, username:friendusername,userIdTwo:specificRequest.userId,usernameTwo:specificRequest.username,isDeleted:false});
        if (!specificRequestTwo){
            return res.status(200).send({"success":false,"message":"Request two does not exist"});
        } 
        else{
            const updatedRequestTwo = {'isAccepted': true}
            await specificRequestTwo.updateOne({ $set: updatedRequestTwo });
            //add the users to the profiles
            profileOne = await Profile.findOne({userId : specificRequest.userId})
            profileTwo = await Profile.findOne({userId : friendId})
  

            profileOneObj = {userId : profileOne.userId, username: profileOne.username}
            profileTwoObj = {userId : profileTwo.userId, username: profileTwo.username}

            let oneIncludes = profileOne.friends.find( vendor => vendor['userId'] === profileTwo.userId);
            let twoIncludes = profileTwo.friends.find( vendor => vendor['userId'] === profileOne.userId);

            if(!oneIncludes){
                console.log("ONE")
                await profileOne.updateOne({$push:{friends: profileTwoObj}});
            }

            if(!twoIncludes){
                console.log("TWO")
                await profileTwo.updateOne({$push:{friends: profileOneObj}});

            }

            
            
            
            res.status(200).send({"success":true,"message":"Friend has been added"});
        }
        // res.status(200).send({"success":true,"message":"Request has been deleted"});

        }
});


//Reject a request
router.get('/rejectRequest/:requestId/', async (req,res) =>{
    const specificRequest = await Requests.findById(req.params.requestId);
    if (!specificRequest){
        return res.status(200).send({"success":false,"message":"Request does not exist"});
    }
    else{
        const updatedRequest = {'isRejected': true}
        await specificRequest.updateOne({ $set: updatedRequest });
        friendId = specificRequest.userIdTwo 
        friendusername = specificRequest.usernameTwo 
        console.log("friendId",friendId)
        console.log("friendusername",friendusername)
        const specificRequestTwo = await Requests.findOne({userId:friendId, username:friendusername,userIdTwo:specificRequest.userId,usernameTwo:specificRequest.username,isDeleted:false});
        if (!specificRequestTwo){
            return res.status(200).send({"success":false,"message":"Request two does not exist"});
        } 
        else{
            const updatedRequestTwo = {'isRejected': true}
            await specificRequestTwo.updateOne({ $set: updatedRequestTwo });
            // //add the users to the profiles
            // profileOne = await Profile.findOne({userId : specificRequest.userId})
            // profileTwo = await Profile.findOne({userId : friendId})
  

            // profileOneObj = {userId : profileOne.userId, username: profileOne.username}
            // profileTwoObj = {userId : profileTwo.userId, username: profileTwo.username}

            // await profileOne.updateOne({$push:{friends: profileTwoObj}});
            // await profileTwo.updateOne({$push:{friends: profileOneObj}});
            
            res.status(200).send({"success":true,"message":"Friend has been rejected"});
        }
        // res.status(200).send({"success":true,"message":"Request has been deleted"});

        }
});



//Delete a request 
router.post('/removeFriend/', async (req,res) =>{
    const profileOne = await Profile.findOne({userId: req.body.userId,username: req.body.username});
    if(!profileOne){
        res.status(200).send({"success":false,"message":"This person's profile does not exist"});  
    }
    else{
        profileTwo = await Profile.findOne({userId: req.body.userIdTwo,username: req.body.usernameTwo});
        if(!profileTwo){
            res.status(200).send({"success":false,"message":"This person who is to be removed does not exist"});  
        }
            
            //Remove the friend 
            else{
                profileOneObj = {userId : profileOne.userId, username: profileOne.username}
                profileTwoObj = {userId : profileTwo.userId, username: profileTwo.username}

                let oneIncludes = profileOne.friends.find( vendor => vendor['userId'] === profileTwo.userId);
                let twoIncludes = profileTwo.friends.find( vendor => vendor['userId'] === profileOne.userId);
                
                if (oneIncludes){
                    //Remove the object
                    console.log("one")
                    await profileOne.updateOne({$pull:{friends:profileTwoObj}});
                }

                if (twoIncludes){
                    //Remove the object
                    console.log("two")
                    await profileTwo.updateOne({$pull:{friends:profileOneObj}});
                }
    

                res.status(200).send({"success":true,"message":"The friend has been removed"});  
            }


            // await profileOne.updateOne({$push:{friends: profileTwoObj}});
            // await profileTwo.updateOne({$push:{friends: profileOneObj}});
            
        

    }
      
});




//Show incoming requests
router.get('/showFriends/:userId/', async (req,res) =>{
    const specificProfile = await Profile.findOne({userId:req.params.userId});
    if (specificProfile){
        const friends = specificProfile.friends
        return res.status(200).send({"success":true,"message":"Friends are shown","data":friends});
    }
    else{
        res.status(200).send({"success":false,"message":"Data could not be shown"});

        }
});



module.exports = router 