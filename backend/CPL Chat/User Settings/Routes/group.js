const router = require('express').Router();
// const User = require('../Models/User');
// const Token = require('../Models/Token');
const Group = require('../Models/Group');
const Profile = require('../Models/Profile');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verify = require('./verifyToken');
const axios = require('axios');
dotenv.config();


router.post('/createGroup', async(req,res) =>{

    if (req.body.members.length === 0){
        membersArray = []
    }
    else{
        membersArray = req.body.members
        membersArray.forEach((member) => {
            member.nickname = member.username

        })
    }

    console.log(membersArray)

    adminArray = [{userId:req.body.userId,username:req.body.username}]

    const group = new Group({
        userId : req.body.userId,
        username : req.body.username,
        groupName : req.body.groupName,
        members : membersArray,
        admins: adminArray

    });
  
  
      const savedObject = await group.save();

    membersArray.forEach(async (member) => {
        specificProfile = await Profile.findOne({userId: member.userId})
        if (specificProfile){
            //Add the group to the users profile
            console.log(savedObject._id.toString())
            groupObject = {groupId: savedObject._id.toString(), groupName: req.body.groupName,isActive: true}
            let groupIncludes = specificProfile.groups.find( group => group['groupId'] === savedObject._id.toString());

            if(!groupIncludes){
                //push the array
                await specificProfile.updateOne({$push:{groups: groupObject}});
            }
            }
        });
        


      res.status(200).send({"success":true,"message":"Group has been created"})
      
   
  });



//Show all the groups for a specific user. The groups they are a part of
router.get('/showGroups/:userId/', async (req,res) =>{
    const specificProfile = await Profile.findOne({userId:req.params.userId});
    if (specificProfile){
        const groups = specificProfile.groups
        return res.status(200).send({"success":true,"message":"groups are shown","data":groups});
    }
    else{
        res.status(200).send({"success":false,"message":"No data could be retrieved",});

        }
});



//Add people to group
router.put("/addPeople/:groupId/", async (req, res) => {
    
    try {
      userId = req.body.userId 
      username = req.body.username 
      userIdTwo = req.body.userIdTwo
      usernameTwo = req.body.usernameTwo
      const group = await Group.findById(req.params.groupId);
      
      const profile = await Profile.findByOne({userId : userIdTwo});
      let groupIncludes = group.admins.find( admin => admin['userId'] === userId);
      let memberIncludes = group.members.find( member => member['userId'] === userIdTwo);
      
      groupObject ={userId: userIdTwo, username: usernameTwo}

      if (group){
        groupId = group._id.toString()
        let profileIncludes = profile.groups.find( group => group['groupId'] === groupId);
        profileObj = {groupId : groupId, groupName: group.groupName, isActive: true}

        if (group.userId === userId){
            if (!memberIncludes){
            await group.updateOne({$push:{members: groupObject}});
            
            if (!profileIncludes){
                await profile.updateOne({$push:{groups: profileObj}});
            }
            res.status(200).json({"success": true, "message": "Member has been added."});
            }
            else{
                res.status(200).json({"success": true, "message": "Member already exists in this group."}); 
            }
            
            
        }

        else if (groupIncludes){
            if (!memberIncludes){
            await group.updateOne({$push:{members: groupObject}});
            if (!profileIncludes){
                await profile.updateOne({$push:{groups: profileObj}});
            }
            res.status(200).json({"success": true, "message": "Member has been added."});
            }
            else{
                res.status(200).json({"success": true, "message": "Member already exists in this group."}); 
            }
        }

        else{
            res.status(200).json({"success": false, "message": "You cannot update the group."});
        }
      

      }
      else{
        res.status(200).json({"success": false, "message": "Group not found"});
      }
     
    } catch (err) {
      res.status(500).json(err);
    }
  });




router.put("/updateGroup/:id/", async (req, res) => {
    
    try {
      userId = req.body.userId 
      username = req.body.username 
      const group = await Group.findById(req.params.id);
      let groupIncludes = group.admins.find( admin => admin['userId'] === userId);


      if (group){

        if (group.userId === userId){
            await group.updateOne({ $set: req.body });
            res.status(200).json({"success": true, "message": "Group has been updated"});
        }

        else if (groupIncludes){
            await group.updateOne({ $set: req.body });
            res.status(200).json({"success": true, "message": "Group has been updated"});
        }

        else{
            res.status(200).json({"success": false, "message": "You cannot update the group."});
        }
      

      }
      else{
        res.status(200).json({"success": false, "message": "Group not found"});
      }
     
    } catch (err) {
      res.status(500).json(err);
    }
  });



//Add people to group
router.put("/removePeople/:groupId/", async (req, res) => {
    
    try {
      userId = req.body.userId 
      username = req.body.username 
      userIdTwo = req.body.userIdTwo
      usernameTwo = req.body.usernameTwo
      const group = await Group.findById(req.params.groupId);
      
      const profile = await Profile.findByOne({userId : userIdTwo});
      let groupIncludes = group.admins.find( admin => admin['userId'] === userId);
      let memberIncludes = group.members.find( member => member['userId'] === userIdTwo);
      
      groupObject ={userId: userIdTwo, username: usernameTwo}

      if (group){
        groupId = group._id.toString()
        let profileIncludes = profile.groups.find( group => group['groupId'] === groupId);
        profileObj = {groupId : groupId, groupName: group.groupName, isActive: true}

        if (group.userId === userId){
            if (memberIncludes){
            await group.updateOne({$pull:{members: groupObject}});
            
            if (profileIncludes){
                await profile.updateOne({$pull:{groups: profileObj}});
            }
            res.status(200).json({"success": true, "message": "Member has been removed."});
            }
            else{
                res.status(200).json({"success": False, "message": "Member is not in this group"}); 
            }
            
            
        }

        else if (groupIncludes){
            if (memberIncludes){
            await group.updateOne({$pull:{members: groupObject}});
            if (profileIncludes){
                await profile.updateOne({$pull:{groups: profileObj}});
            }
            res.status(200).json({"success": true, "message": "Member has been removed."});
            }
            else{
                res.status(200).json({"success": true, "message": "Member is not in this group."}); 
            }
        }

        else{
            res.status(200).json({"success": false, "message": "You cannot update the group."});
        }
      

      }
      else{
        res.status(200).json({"success": false, "message": "Group not found"});
      }
     
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.put("/leaveGroup/:id/", async (req, res) => {
    
    try {
      userId = req.body.userId 
      username = req.body.username 
      const group = await Group.findById(req.params.id);
      const profile = await Profile.findOne({userId : userId});



      if ((group) && (profile)){

        //if the person is a member
        let groupIncludes = group.members.find( member => member['userId'] === userId);
        groupId = group._id.toString()
        let profileIncludes = profile.groups.find( group => group['groupId'] === groupId);

        if ((groupIncludes) && (profileIncludes)){
            profileObj = {groupId : groupId, groupName: group.groupName, isActive: true}
            groupObject ={userId: userId, username: username}
            //Remove them 
            await group.updateOne({$pull:{members: groupObject}});
            await profile.updateOne({$pull:{groups: profileObj}});
            res.status(200).json({"success": true, "message": "The person has been removed from the group"});

        }

        else{
            res.status(200).json({"success": false, "message": "The person could not be removed from the group"});
        }



      }
      else{
        res.status(200).json({"success": false, "message": "Group not found"});
      }
     
    } catch (err) {
      res.status(500).json(err);
    }
  });




module.exports = router 