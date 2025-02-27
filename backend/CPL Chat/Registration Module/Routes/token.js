const router = require('express').Router();
const Token = require('../Models/Token');

router.post('/validateToken/', async (req,res) =>{
    const specificToken = await Token.findOne({token:req.body.token});
    if (!specificToken){
        return res.status(200).send({"success":false,"message":"Token does not exist"});
    }
    else{
        if (specificToken.isValid === false){
            return res.status(200).send({"success":false,"message":"Token has become expired"});
        }
        else{
            return res.status(200).send({"success":true,"message":"Token is valid"});
        }

        }
});

module.exports = router 