const router = require('express').Router();
const User = require('../Models/User');
const Token = require('../Models/Token');
const Link = require('../Models/Link');
const OTP = require('../Models/OTP');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const verify = require('./verifyToken')
const axios = require('axios');
const { render } = require('ejs');
var cors = require('cors')
dotenv.config();
router.use(cors())

// app.set('views','./views');

// app.set('view engine', 'ejs');

// //for the static folders 
// app.use(express.static('public'))

router.get('/home/', async (req,res) =>{
    res.render('index');

});

router.get('/signup_page/', async (req,res) =>{
    res.render('signup');

});


router.get('/forgot_password/', async (req,res) =>{
    res.render('forgotpassword');

});


async function sendemail(email,url_link){
var flagg = false
from = process.env.EMAIL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sameesayeed880@gmail.com',
      pass: 'kookabura'
    }
  });


  const mailOptions = {
    from: from,
    to: email,
    subject: 'Verify your account',
    text: url_link
  };



  
const trans = await transporter.sendMail(mailOptions, async function(error, info){
    
    if (error) {
      console.log(error);
      const errors = error
      flagg = false
      
    } else {
      infoResponse =  info.response
      console.log('Email sent: ' + info.response);
      flagg = true

    }
  });
//   setTimeout(() => {
//     const trans = transporter.sendMail(mailOptions, async function(error, info){
//         console.log("Inside the trans function")
//         if (error) {
//           console.log(error);
//           const errors = error
//           flagg = false
          
//         } else {
//           infoResponse =  info.response
//           console.log('Email sent: ' + info.response);
//           flagg = true
//           console.log("flagg")
//           console.log(flagg)
          
//         }
//       });
//   }, 10000);

if (trans){
    console.log("successful")
    
}
else{
    console.log("unsuccessful")
}
return flagg

  
};




async function forgotsendemail(email,otp){
    var flagg = false
    from = process.env.EMAIL
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sameesayeed880@gmail.com',
          pass: 'kookabura'
        }
      });
    
    
      const mailOptions = {
        from: from,
        to: email,
        subject: 'Change your password',
        text: otp
      };
    
    
    
      
    const trans = await transporter.sendMail(mailOptions, async function(error, info){
        
        if (error) {
          console.log(error);
          const errors = error
          flagg = false
          
        } else {
          infoResponse =  info.response
          console.log('Email sent: ' + info.response);
          flagg = true
    
        }
      });
    //   setTimeout(() => {
    //     const trans = transporter.sendMail(mailOptions, async function(error, info){
    //         console.log("Inside the trans function")
    //         if (error) {
    //           console.log(error);
    //           const errors = error
    //           flagg = false
              
    //         } else {
    //           infoResponse =  info.response
    //           console.log('Email sent: ' + info.response);
    //           flagg = true
    //           console.log("flagg")
    //           console.log(flagg)
              
    //         }
    //       });
    //   }, 10000);
    
    if (trans){
        console.log("successful")
        
    }
    else{
        console.log("unsuccessful")
    }
    return flagg
    
      
    };












function generateLink(userId){
    url_link = process.env.DOMAIN + "api/auth/verify/"+ userId
    return url_link
}

function generateOTP(){
    const seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    return seq
}

//Register 
router.post('/register/', async (req,res) =>{

    try{
        //Find if this user exists
        specificUser = await User.find({email:req.body.email})
        if (specificUser.length === 0){
            //Generate and hash password
            console.log("User nai ei emailer")
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password,salt);
            
    
            //User object
            const user =  await new User({
                username : req.body.username,
                email : req.body.email,
                password: hashedPassword
            });
            
    
    
    
            //Save new user
            const new_user = await user.save();
            //Generatelink
            urlLink = generateLink(new_user._id)
           
            //Create a link object
            const linkObject =  await new Link({
                userId : new_user._id,
                link : urlLink,
                forRegistration: true,
                
            });
            
            const new_link = await linkObject.save();
            //Send email 
            sendEmail = await sendemail(new_user.email,urlLink)
            // let flag = false;
            // console.log("email pathabe")
            // const sendEmail = axios.post('http://127.0.0.1:7000/api/auth/sendemail', {
            //     email: new_user.email,
            //     url_link: urlLink
              
            //   }).then(function (sendEmail) {
                
            //     console.log(sendEmail.data)
            //     if (sendEmail.data.success === true){
            //         flag = true;
            //     }
            //     else{
            //         flag = false
            //     }
                
            //   });
            
            console.log("Send email er result")
            
            // if (flag === true){
                res.status(200).send({'success':true,'message':'User has been created','data':new_user});
            // }
            // else{
            //     deleteUser = await User.findById(new_user._id)
            //     await deleteUser.deleteOne();

            //     deleteLink = await Link.findById(new_link._id)
            //     await deleteLink.deleteOne();
            //     res.status(200).send({'success':false,'message':'Some problem occurred'});


            // }

            

        }
        
        else{
            console.log("user ase ")
            if (specificUser[0].isVerified === false){
                console.log("user verified na")
                //Delete the user 
                specUserId =specificUser[0]._id
                console.log(specUserId)
                specUser = await User.findById(specUserId)
                console.log(specUser)
                if (specUser){
                    console.log("spec user")
                    await specUser.deleteOne();
                    console.log("deleted")
                    //Create a new user
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(req.body.password,salt);
            
                    //User object
                    const user =  await new User({
                        username : req.body.username,
                        email : req.body.email,
                        password: hashedPassword
                    });
            
            
            
                    //Save new user
                    const new_user = await user.save();
                    //Generatelink
                    urlLink = generateLink(new_user._id)
                    //Delete the old link
                    // oldLInk = await Link.find({userId:})
                    // console.log("old link")
                    // console.log(oldLink)
                    // if (oldLink.length !== 0){
                    //     link_id = oldLink[0]._id
                    //     specOldLink = await Link.findById(link_id)
                    //     if (specOldLink) {
                    //         await specOldLink.deleteOne()
                    //     }
                    // }
                    //Create a link object
                    const linkObject =  await new Link({
                        userId : new_user._id,
                        link : urlLink,
                        forRegistration: true,
                        
                    });
                    const new_link = await linkObject.save();
                    //Send email 
                    sendEmail = sendemail(new_user.email,urlLink)
                   
                    // if (sendEmail === true){
                        res.status(200).send({'success':true,'message':'User has been created','data':new_user});
                    // }
                    // else{
                        // deleteUser = await User.findById(new_user._id)
                        // await deleteUser.deleteOne();

                        // deleteLink = await Link.findById(new_link._id)
                        // await deleteLink.deleteOne();
                        // res.status(200).send({'success':false,'message':'Some problem occurred'});


                    // }
        
                    
                }

            }
            else{
                res.status(200).send({'success':false,'message':'This user already exists'});
            }
        }

    }
    catch(err){
        res.status(500).send({'success':false,'message':'An error has occured','error':err});
    }

});

router.get('/verify/:userId', async (req,res) =>{

    try{
        // change the link status
        link_url = process.env.DOMAIN + "api/auth/verify/"+ req.params.userId
        console.log(link_url)
        specificLinkObject = await Link.find({link : link_url,forRegistration:true})

        if (specificLinkObject.length === 0){
            res.status(200).send({'success': 'false', 'message': 'Link does not exist'})
        }
        else if(specificLinkObject[0].isClicked === true){
            res.status(200).send({'success': 'false', 'message': 'Link has expired'})
        }
        else{
            //Find the user 
            specificUser = await User.findById(req.params.userId)
            if (specificUser){
                //Change the verification status 
                const updatedUser = {'isVerified': true}
                await specificUser.updateOne({ $set: updatedUser });

                //Change the link click status 
                const updatedLink = {'isClicked': true}
                await specificLinkObject[0].updateOne({ $set: updatedLink });
                request_url = process.env.USERSETTINGS_MODULE_DOMAIN +"api/profile/createProfile/"
        
                const result = axios.post(request_url,{
                    userId: req.params.userId,
                    username: specificUser.username
                  
                  }).then(function (response) {
                    
                    if (response.data.success === false){
                        console.log("false hochche")
                        
                    }
                    else{
                        console.log("true hochche")
                        
                    }
                    
                  });

                res.status(200).send({'success': 'true', 'message': 'Account has been verified'})

            }
            else{
                res.status(200).send({'success': 'false', 'message': 'User not found'})
            }
        }

            
    }
    catch(err){
        res.status(500).send({'success': 'false', 'message': 'User not found','error':err});
    }

});


//Login
router.post('/login/',async (req,res) => {

    


    try{
        const specificUser = await User.findOne({email:req.body.email,isVerified:true});
        
        if (!specificUser){
            res.status(200).send({"success":false,"message":"User not found"});
        }
        else{
            
            validPassword = await bcrypt.compare(req.body.password,specificUser.password);
            if (!validPassword){
                res.status(200).send({"success":false,"message":"Wrong password"});
            }
            else{
                //Create and assign a token
                
                const token = jwt.sign({_id: specificUser._id},process.env.TOKEN_SECRET,{expiresIn: "1h"});
                //add it to the header 
                
                res.header('auth-token',token);
                //Create and assign a token
                const refresh_token = jwt.sign({_id: specificUser._id},process.env.REFRESH_TOKEN_SECRET);
                //add it to the header 
                res.header('refresh-token',refresh_token);
                //Store the tokens
                const tokenObj =  await new Token({
                    userId : specificUser._id,
                    token : token,
                    refreshtoken: refresh_token
                });
                const new_token = await tokenObj.save();
                
                res.status(200).json({"success":true,"access_token":token,"refresh_token":refresh_token,"userId":specificUser._id,"username":specificUser.username,"email":specificUser.email});
            }
        }

    }
    catch(err){
        res.status(500).send(err);
    }



});



router.post('/login2/',async (req,res) => {

    console.log(req.body.email)


    try{
        const specificUser = await User.findOne({email:req.body.email,isVerified:true});
        if (!specificUser){
            res.status(404).send("User not found");
        }
        else{
            validPassword = await bcrypt.compare(req.body.password,specificUser.password);
            if (!validPassword){
                res.render('wrongpassword')
            }
            else{
                //Create and assign a token
                const token = jwt.sign({_id: specificUser._id},process.env.TOKEN_SECRET,{expiresIn: "1h"});
                //add it to the header 
                res.header('auth-token',token);
                //Create and assign a token
                const refresh_token = jwt.sign({_id: specificUser._id},process.env.REFRESH_TOKEN_SECRET);
                //add it to the header 
                res.header('refresh-token',refresh_token);
                //Store the tokens
                const tokenObj =  await new Token({
                    userId : specificUser._id,
                    token : token,
                    refreshtoken: refresh_token
                });
                const new_token = await tokenObj.save();
                // res.status(200).json({"access_token":token,"refresh_token":refresh_token});
                res.render('first',{email:specificUser.email, username:specificUser.username,access_token:token})
            }
        }

    }
    catch(err){
        res.status(500).send(err);
    }



});


router.post('/register2/', async (req,res) =>{

    try{
        //Find if this user exists
        specificUser = await User.find({email:req.body.email})
        if (specificUser.length === 0){
            //Generate and hash password
            console.log("User nai ei emailer")
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password,salt);
            
    
            //User object
            const user =  await new User({
                username : req.body.username,
                email : req.body.email,
                password: hashedPassword
            });
            
    
    
    
            //Save new user
            const new_user = await user.save();
            //Generatelink
            urlLink = generateLink(new_user._id)
           
            //Create a link object
            const linkObject =  await new Link({
                userId : new_user._id,
                link : urlLink,
                forRegistration: true,
                
            });
            
            const new_link = await linkObject.save();
            //Send email 
            sendEmail = await sendemail(new_user.email,urlLink)
            // let flag = false;
            // console.log("email pathabe")
            // const sendEmail = axios.post('http://127.0.0.1:7000/api/auth/sendemail', {
            //     email: new_user.email,
            //     url_link: urlLink
              
            //   }).then(function (sendEmail) {
                
            //     console.log(sendEmail.data)
            //     if (sendEmail.data.success === true){
            //         flag = true;
            //     }
            //     else{
            //         flag = false
            //     }
                
            //   });
            
            console.log("Send email er result")
            
            // if (flag === true){
                //res.status(200).send({'success':true,'message':'User has been created','data':new_user});
                res.render('index',{registration:true})
            // }
            // else{
            //     deleteUser = await User.findById(new_user._id)
            //     await deleteUser.deleteOne();

            //     deleteLink = await Link.findById(new_link._id)
            //     await deleteLink.deleteOne();
            //     res.status(200).send({'success':false,'message':'Some problem occurred'});


            // }

            

        }
        
        else{
            console.log("user ase ")
            if (specificUser[0].isVerified === false){
                console.log("user verified na")
                //Delete the user 
                specUserId =specificUser[0]._id
                console.log(specUserId)
                specUser = await User.findById(specUserId)
                console.log(specUser)
                if (specUser){
                    console.log("spec user")
                    await specUser.deleteOne();
                    console.log("deleted")
                    //Create a new user
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(req.body.password,salt);
            
                    //User object
                    const user =  await new User({
                        username : req.body.username,
                        email : req.body.email,
                        password: hashedPassword
                    });
            
            
            
                    //Save new user
                    const new_user = await user.save();
                    //Generatelink
                    urlLink = generateLink(new_user._id)
                    //Delete the old link
                    // oldLInk = await Link.find({userId:})
                    // console.log("old link")
                    // console.log(oldLink)
                    // if (oldLink.length !== 0){
                    //     link_id = oldLink[0]._id
                    //     specOldLink = await Link.findById(link_id)
                    //     if (specOldLink) {
                    //         await specOldLink.deleteOne()
                    //     }
                    // }
                    //Create a link object
                    const linkObject =  await new Link({
                        userId : new_user._id,
                        link : urlLink,
                        forRegistration: true,
                        
                    });
                    const new_link = await linkObject.save();
                    //Send email 
                    sendEmail = sendemail(new_user.email,urlLink)
                   
                    // if (sendEmail === true){
                        //res.status(200).send({'success':true,'message':'User has been created','data':new_user});
                        res.render('index',{registration:true})
                    // }
                    // else{
                        // deleteUser = await User.findById(new_user._id)
                        // await deleteUser.deleteOne();

                        // deleteLink = await Link.findById(new_link._id)
                        // await deleteLink.deleteOne();
                        // res.status(200).send({'success':false,'message':'Some problem occurred'});


                    // }
        
                    
                }

            }
            else{
                //res.status(200).send({'success':false,'message':'This user already exists'});
                res.render('signup',{registration:false})
            }
        }

    }
    catch(err){
        //res.status(500).send({'success':false,'message':'An error has occured','error':err});
        res.render('signup',{registration:false})
    }

});


router.post('/logout/',verify,async(req,res) =>{

    console.log("inside the logout API")

    const token = req.header('auth-token');
    if (!token){
        return res.status(200).send({'success':false, 'message':'No token found'});
    }

    else{
        const specificToken = await Token.findOne({token:token});
        if (!specificToken){
            return res.status(200).send({'success':false, 'message':'Cannot log out'});
        }
        else{
            userId = specificToken.userId
            const specificUser = await User.findById(userId)
            if (specificUser){
                updatedUser = {isConnected: false}
                await specificUser.updateOne({ $set: updatedUser});
                updatedToken = {isValid: false}
                await specificToken.updateOne({ $set: updatedToken});
                return res.status(200).send({'success':true, 'message':'Logged out successfully'});

            }
            else{
                return res.status(200).send({'success':false, 'message':'Cannot log out'});
        
            }
        }
    }


})


router.post('/changePassword/',verify,async(req,res) =>{

    try{
        const specificUser = await User.findOne({email:req.body.email,isVerified:true});
        if (!specificUser){
            res.status(404).send("User not found");
        }
        else{
            validPassword = await bcrypt.compare(req.body.password,specificUser.password);
            if (!validPassword){
                res.status(400).send("Wrong password");
            }
            else{
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.newPassword,salt);
                // if (hashedPassword === specificUser.password){
                //     res.status(200).send({"success": false,"message":"You have entered your old password.Please change it to something different."})
                // }
                userObject = {password:hashedPassword}
                await specificUser.updateOne({ $set: userObject  });
                return res.status(200).send({'success':true, 'message':'Password has been changed successfully'});
            }

    }
}
    catch(err){
        res.status(500).send(err);
    }

});


router.post('/forgotPassword/',async(req,res) =>{

    try{
        const specificUser = await User.findOne({email:req.body.email,isVerified:true});
        if (!specificUser){
            res.status(404).send({"success":false,"message":"User does not exist"});
        }
        else{
            //generate OTP 
            otp = generateOTP() 
            console.log("otp")
            console.log(otp)
            //send email
            sendEmail = forgotsendemail(req.body.email,otp)

            //Save the otp
            const otpObject =  await new OTP({
                email : req.body.email,
                digit : otp,
                isValid: true
            });
            
            const new_otp = await otpObject.save();
            res.status(200).send({"success":true,"message":"Code has been sent to your email"});

            
        }
  
}
    catch(err){
        res.status(500).send(err);
    }

});


router.post('/verifyOtp/',verify,async(req,res) =>{

    try{
        const specificOtp = await OTP.findOne({email:req.body.email,isValid:true,digit:req.body.otp});
        if (!specificOtp){
            res.status(404).send({"success":false,"message":"OTP does not exist or has become invalid"});
        }
        else{
            
            //Make the otp invalid
            const updatedOTP = {'isValid': false,'canPasswordBeChanged': true}
            await specificOtp.updateOne({ $set: updatedOTP });
            res.status(200).send({"success":true,"message":"OTP has been validated.Please change your password now"});

            
        }
  
}
    catch(err){
        res.status(500).send(err);
    }

});



// router.post('/changeForgottenPassword/',verify,async(req,res) =>{

//     try{
//         const specificUser = await User.findOne({email:req.body.email,isVerified:true});
//         if (!specificUser){
//             res.status(404).send("User not found");
//         }
//         else{
//             const specificOtp = await OTP.findOne({email:req.body.email,isValid:false,canPasswordBeChanged:true,digit:req.body.otp});
//             if (!specificOtp){
//                 return res.status(200).send({'success':false, 'message':'Password could not be changed'});
            
//             }
//             else{
//                 const salt = await bcrypt.genSalt(10);
//                 const hashedPassword = await bcrypt.hash(req.body.newPassword,salt);
//                 userObject = {password:hashedPassword}
//                 await specificUser.updateOne({ $set: userObject  });
//                 return res.status(200).send({'success':true, 'message':'Password has been changed successfully'});
//             }

            
//         }
  
// }
//     catch(err){
//         res.status(500).send(err);
//     }

// });


router.post('/changeForgottenPassword/',async(req,res) =>{
    console.log(req.body.email)
    console.log(req.body.otp)
    console.log(req.body.newPassword)


    try{
        const specificOtp = await OTP.findOne({email:req.body.email,isValid:true,digit:req.body.otp});
        if (!specificOtp){
            res.status(404).send({"success":false,"message":"OTP does not exist or has become invalid"});
        }
        else{
            
            //Make the otp invalid
            const updatedOTP = {'isValid': false,'canPasswordBeChanged': true}
            await specificOtp.updateOne({ $set: updatedOTP });
            const specificUser = await User.findOne({email:req.body.email,isVerified:true});
            if (!specificUser){
                res.status(404).send({"success":false,"message":"User does not exist."});
            }
            else{
                const specificOtp1 = await OTP.findOne({email:req.body.email,isValid:false,canPasswordBeChanged:true,digit:req.body.otp});
                if (!specificOtp1){
                    return res.status(200).send({'success':false, 'message':'Password could not be changed'});
                
                }
                else{
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(req.body.newPassword,salt);
                    userObject = {password:hashedPassword}
                    await specificUser.updateOne({ $set: userObject  });
                    return res.status(200).send({'success':true, 'message':'Password has been changed successfully'});
                }
    
                
            }
            

            
        }
  
}
    catch(err){
        res.status(500).send(err);
    }

});





router.post('/forgotPassword2/',async(req,res) =>{

    try{
        const specificUser = await User.findOne({email:req.body.email,isVerified:true});
        if (!specificUser){
            res.status(404).send({"success":false,"message":"User does not exist"});
        }
        else{
            //generate OTP 
            otp = generateOTP() 
            console.log("otp")
            console.log(otp)
            //send email
            sendEmail = forgotsendemail(req.body.email,otp)

            //Save the otp
            const otpObject =  await new OTP({
                email : req.body.email,
                digit : otp,
                isValid: true
            });
            
            const new_otp = await otpObject.save();
            res.status(200).send({"success":true,"message":"Email has been sent"});

            
        }
  
}
    catch(err){
        res.status(500).send(err);
    }

});




router.post('/changeForgottenPassword2/',verify,async(req,res) =>{

    try{
        const specificUser = await User.findOne({email:req.body.email,isVerified:true});
        if (!specificUser){
            res.status(404).send("User not found");
        }
        else{
            const specificOtp = await OTP.findOne({email:req.body.email,isValid:false,canPasswordBeChanged:true,digit:req.body.otp});
            if (!specificOtp){
                return res.status(200).send({'success':false, 'message':'Password could not be changed'});
            
            }
            else{
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.newPassword,salt);
                userObject = {password:hashedPassword}
                await specificUser.updateOne({ $set: userObject  });
                return res.status(200).send({'success':true, 'message':'Password has been changed successfully'});
            }

            
        }
  
}
    catch(err){
        res.status(500).send(err);
    }

});

//to use this router in app.js we will have to export 
module.exports = router 