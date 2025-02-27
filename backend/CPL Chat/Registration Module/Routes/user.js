const router = require('express').Router();
const User = require('../Models/User');

router.post('/makeOnline/', async (req,res) =>{
    const specificUser = await User.findOne(req.body.userId);
    if (!specificUser){
        return res.status(200).send({"success":false,"message":"User does not exist"});
    }
    else{
        const updatedUser = {'isConnected': true}
        await specificUser.updateOne({ $set: updatedUser });
        res.status(200).send({"success":true,"message":"The user's status has been changed to online"});

        }
});


router.post('/makeOffine/', async (req,res) =>{
    const specificUser = await User.findOne(req.body.userId);
    if (!specificUser){
        return res.status(200).send({"success":false,"message":"User does not exist"});
    }
    else{
        const updatedUser = {'isConnected': false}
        await specificUser.updateOne({ $set: updatedUser });
        res.status(200).send({"success":true,"message":"The user's status has been changed to offline"});

        }
});


router.get('/getUsername/:userId/', async (req,res) =>{
    const specificUser = await User.findById(req.params.userId);
    if (!specificUser){
        return res.status(200).send({"success":false,"message":"User does not exist"});
    }
    else{
        username = specificUser.username

        res.status(200).send({"success":true,"data":username});

        }
});

module.exports = router 