const User = require('../users/user.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var generator = require('generate-password');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shivanitest14@gmail.com',
      pass: 'test@12345678'
    }
});


// api for user register
router.post('/register', function(req, res) {
    if(req.body.email==undefined || req.body.username==undefined){
        return res.status(400).json({
            message: 'Please enter all the fields',
            status: 'not ok'
        });
    }
    else{ 
        //var hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);
    
        User.forge({email:req.body.email}).fetch().then(function(rows){
            if (rows) {
                return res.send("User already registered!");
            } else {
                // if there is no user with that email then create the user
                var newUserMysql = new Object();
                
                newUserMysql.email    = req.body.email;
                newUserMysql.username    = req.body.username;
                //newUserMysql.password = hashedPassword;
                newUserMysql.password = generator.generate({
                    length: 10,
                    numbers: true
                });
                
                User.forge(newUserMysql).save().then(function(data){
                    var mailOptions = {
                        from: 'shivanitest14@gmail.com',
                        to: 'sharma.14shivani@gmail.com',
                        subject: 'Registration Password',
                        text: 'Your email id is : '+newUserMysql.email+ ' Your Password is : '+newUserMysql.password
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                    });
                    return res.status(200).json({
                        message: 'User registered successfully!',
                        user   : data,
                        status: 'ok'
                    });
                }).catch(function(err){
                    return res.status(400).json({
                        message: 'Error registering user!',
                        user   : data
                    });
                });	
            }	
        }).catch(function(err){
            res.send(err);
        });
    }
});

// api to check user authentication

router.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    res.json({"msg":"Success! You can not see this without a token",user:req.user});
});


// api for getting all the data of users from the database after if the user is authenticated

router.get("/getusers", passport.authenticate('jwt', { session: false }), getUsersData);
//router.get("/getuser", getUsersData);

function getUsersData(req,res){
    User.fetchAll().then(function(data){
        res.json({status: 'ok',user:data});
    }).catch(function(error) { 
        res.status(404).json({
            status: 'not ok',
            data: null
        });
    });
}


module.exports = router;