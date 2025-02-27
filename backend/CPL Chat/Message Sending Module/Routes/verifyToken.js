const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require('axios');
// const Token = require('../Models/Token');
dotenv.config();

module.exports = async function (req,res,next){
    //Checking if the request header contains this token
    const token = req.header('auth-token');
    

    if (!token){
        return res.status(401).send('Access Denied');
    }

    else{
        // try{
            //Make request to the registration module.
            
            request_url = process.env.REGISTRATION_MODULE_DOMAIN +"api/token/validateToken/"
            console.log(request_url)
            const result = axios.post(request_url, {
                token: token,
                
              
              }).then(function (response) {
                console.log(response.data)
                if (response.data.success === false){
                    return res.status(401).send('Access Denied or the token has become expired'); 
                }
                else{
                    next(); 
                }
                
              });
            

    // }
        // catch(error){
        //     res.status(400).send("Invalid");

        // }
    }

}