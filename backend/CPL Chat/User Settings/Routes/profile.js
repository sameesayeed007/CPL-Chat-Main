const router = require('express').Router();
// const User = require('../Models/User');
// const Token = require('../Models/Token');
const Profile = require('../Models/Profile');
const Requests = require('../Models/Requests');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verify = require('./verifyToken');
const axios = require('axios');
dotenv.config();
var cors = require('cors')
router.use(cors())



router.get('/test/',verify, (req,res) =>{
	// console.log("Node js and socket is running");
    // res.send(socket_id);
    return res.status(200).send('kaaj kortese'); 
    

});


router.post('/createProfile', async(req,res) =>{

    

    const profile = new Profile({
        userId : req.body.userId,
        username : req.body.username,
        fullName : "",
        profilePhoto : "",
        address : "",
        phoneNumber : "",



    });
  
  
      const savedObject = await profile.save();
      console.log("profile created")
      res.status(200).send({"success":true,"message":"Profile has been created"})
      
   
  });



router.get('/showProfile/:userId/', async (req,res) =>{
        console.log("Hits API")
        const specificProfile = await Profile.findOne({userId: req.params.userId});
        if (!specificProfile){
            return res.status(200).json({"success":false,"message":"Profile does not exist"});
        }
        else{
            res.status(200).json({"success":true,"message":"Profile data is shown","data":specificProfile});
    
            }
    });


// router.get('/showProfile/:profileId/', async (req,res) =>{
//     const specificProfile = await Profile.findById(req.params.profileId);
//     if (!specificProfile){
//         return res.status(200).send({"success":false,"message":"Proile does not exist"});
//     }
//     else{
//         res.status(200).send({"success":true,"message":"Profile data is shown","data":specificProfile});

//         }
// });

router.put("/updateProfile/:id/", async (req, res) => {
    console.log("inside the api")
    try {
      const profile = await Profile.findById(req.params.id);
      console.log("proile")
      console.log(profile)

      if (profile){
      
        await profile.updateOne({ $set: req.body });
        res.status(200).json({"success": true, "message": "profile has been updated"});
      }
      else{
        res.status(200).json({"success": false, "message": "profile not found"});
      }
     
    } catch (err) {
      res.status(500).json(err);
    }
  });



router.get('/deleteProfile/:profileId/', async (req,res) =>{
    const specificProfile = await Profile.findById(req.params.profileId);
    if (!specificProfile){
        return res.status(200).send({"success":false,"message":"Proile does not exist"});
    }
    else{
        const updatedProfile = {'isDeleted': true}
        await specificProfile.updateOne({ $set: updatedProfile });

        res.status(200).send({"success":true,"message":"Profile has been deleted"});

        }
});



router.post('/searchUser/', async (req,res) =>{
const specificProfile = await Profile.find({ username: {'$regex': req.body.name, '$options': 'i'}})
const userProfile = await Profile.findOne({userId : req.body.userId})
const userFriends = userProfile.friends
let incomingIds = []
let outgoingIds = []

const incomingrequests = await Requests.find({userId:req.body.userId,isIncoming:true,isDeleted: false, isRejected:false,isAccepted: false});

if (incomingrequests.length === 0){
    incomingIds = incomingIds
}

else{
  incomingrequests.forEach(incoming =>{
    incomingIds.push(incoming.userIdTwo)

  })
}

const outgoingrequests = await Requests.find({userId:req.body.userId,isIncoming:false,isDeleted: false, isRejected:false,isAccepted: false});

if (outgoingrequests.length === 0){
  outgoingIds = outgoingIds
}

else{
  outgoingrequests.forEach(outgoing =>{
    outgoingIds.push(outgoing.userIdTwo)

  })
}

console.log(userFriends)
let userFriendIds = []
userFriends.forEach(userFriend =>{
  userFriendIds.push(userFriend.userId)
})
console.log(userFriendIds)

  if (specificProfile.length === 0){
      return res.status(200).send({"success":false,"message":"No users found"});
  }
  else{

      let allProfiles = []
    
      specificProfile.forEach(profile =>{

        let isMe = false
        let isFriend = false
        let isRequestSent = false 
        let isRequestReceived = false
        
        if (profile.userId === req.body.userId){
          isMe = true
        }
        else{
          isMe = false
        }

        
        if (userFriendIds.includes(profile.userId)){
          isFriend = true
        }

        else{
          isFriend = false
        }
        if (incomingIds.includes(profile.userId)){
          isRequestReceived = true
        }

        else{
          isRequestReceived = false
        }
        if (outgoingIds.includes(profile.userId)){
          isRequestSent = true
        }

        else{
          isRequestSent = false
        }

        
        profileObj = {_id: profile._id, userId: profile.userId, username: profile.username, fullName: profile.fullName, profilePhoto: profile.profilePhoto,address: profile.address, phoneNumber: profile.phoneNumber,friends: profile.friends, groups: profile.groups,createdGroups: profile.createdGroups,isOwn:isMe, isFriend: isFriend,isRequestReceived:isRequestReceived,isRequestSent:isRequestSent}
        allProfiles.push(profileObj)
 
      })

      res.status(200).send({"success":true,"message":"The users are shown as below","data":allProfiles});

      }
});


module.exports = router 

