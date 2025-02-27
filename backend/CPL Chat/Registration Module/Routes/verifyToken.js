const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Token = require('../Models/Token');
dotenv.config();

module.exports = async function (req,res,next){
    //Checking if the request header contains this token
    const token = req.header('auth-token');

    if (!token){
        return res.status(401).send('Access Denied');
    }

    else{
        try{
            //Find the specific token 
            const specificToken = await Token.findOne({token:token});
            if (!specificToken){
                return res.status(401).send('Access Denied');
            }
            else{
                if (specificToken.isValid === false){
                    return res.status(401).send('Access Denied.The token has expired'); 
                }
                else{
                    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
                    req.user = verified;
                    next();
                }

        }
    }
        catch(error){
            res.status(400).send("Invalid");

        }
    }

}