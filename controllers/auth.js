const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserOtpVerification = require('../models/UserOtpVerification')

exports.signup = (req, res) => {
    console.log(req.body);
    const {name, email, password} = req.body;
    User.findOne({email}).exec((err, user)=>{
        if(user){
            return res.status(400).json({error : "User with this email already exists."})
        }
        const token = jwt.sign({name, email, password}, process.env.JWT_ACC_ACTIVATION, {expiresIn: '20m'});
        
        const mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'saipreetham3022@gmail.com',
                pass: 'zzzeyuxeroukvpft'
            }
        })
        
        const data = {
            from: 'saipreetham3022@gmail.com',
            to: email,
            subject: 'Account Activation Link',
            html: `
            <h2>Please click on the given link to activate your account</h2>
            <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>
            <h3>Verification OTP : ${otp}</h3>
            `
        };
        
        mailTransporter.sendMail(data, (err)=>{
            if(err){
                return res.json({
                    message: err.message
                });
            }
            return res.json({
                message: `Email has been sent to ${email}, kindly activate your account`
            });
        });
    });
};

exports.activateAccount = (req,res) => {
    const {token,Userotp} = req.body;
    if(token){
        jwt.verify(token, process.env.JWT_ACC_ACTIVATION, function(err, decodedToken){
            if(err){
                return res.status(400).json({error : "Incorrect or Expired Link."})
            }
            const {name, email, password, opt} = decodedToken;
            User.findOne({email}).exec((err, user)=>{
                if(user)
                return res.status(400).json({error : "User with this email already exists."})
                let newUser = new User({name, email, password});
                newUser.save((err, success)=>{
                    if(err){
                        console.log("Error in Signup : ", err);
                        return res.status(400), json({error : err});
                    }
                    res.json({
                        message : "SignUp Success!"
                    });
                });
            });
        })
    }else {
        return res.json({error : 'Something went Wrong!!!'})
    }
}


//Create user without email account activation
// exports.signup = (req, res) => {
//     console.log(req.body);
//     const {name, email, password} = req.body;
//     User.findOne({email}).exec((err, user)=>{
//         if(user)
//             return res.status(400).json({error : "User with this email already exists."})
//         let newUser = new User({name, email, password});
//         newUser.save((err, success)=>{
//             if(err){
//                 console.log("Error in Signup : ", err);
//                 return res.status(400), json({error : err});
//             }
//             res.json({
//                 message : "SignUp Success!"
//             });
//         });
//     });
// };