const User = require('../users/user.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var generator = require('generate-password');
var secret_key = require('./../../middleware/auth.js');
var request = require('request');

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
                    // send system generated password mail to user who is registering himself 
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
                        message: 'Username already found!'
                    });
                }); 
            }   
        }).catch(function(err){
            res.send(err);
        });
    }
});


// api for user login by using jwt stategy

router.post("/login", function(req, res) {
    if(req.body.email && req.body.password){
      var email = req.body.email;
      var password = req.body.password;
    }
    User.forge({email: email}).fetch().then(function(user) {
        if(!user){
            res.status(401).json({message:"Incorrect email!"});
        }
        bcrypt.compare(password,user.attributes.password,function(err,result){
            if(result==false){
                res.status(401).json({message:"password did not match"});
            }
            else{
                var payload = {id: user.attributes.id};
                var token = jwt.sign(payload, secret_key);
                res.json({message: "ok", token: token});
            }
        });
    }).catch(function(err){
        return err;
    });
});

  
// used to serialize the user
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// router.get('/auth/google/callback', 
//   passport.authenticate('google', {failureRedirect: '#/login'}),
//   function(req, res) {
//     res.redirect('http://localhost:3000/#/');
// });

router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));
  
router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
});


// api to check user authentication using jwt strategy

router.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    res.json({"msg":"Success! You can not see this without a token",user:req.user});
});


// api to all the data of users from the database after checking the user is authenticated or not

router.post("/adduser", passport.authenticate('jwt', { session: false }), addUserData);
router.post("/edituser/:id", passport.authenticate('jwt', { session: false }), editUserData);
router.get("/getuser", passport.authenticate('jwt', { session: false }), getUserData);


function addUserData(req,res){
    var user_data = new Object();
    user_data.email    = req.body.email;
    user_data.username    = req.body.username;
    user_data.firstName    = req.body.firstName;
    user_data.lastName    = req.body.lastName;
    user_data.password = generator.generate({
        length: 10,
        numbers: true
    });

    User.forge({email:req.body.email}).fetch().then(function(rows){
        if (rows) {
            return res.send("User already exist in the database!");
        } else {
            // if there is no user with that email then add the user
            
            User.forge(user_data).save().then(function(data){
                var mailOptions = {
                    from: 'shivanitest14@gmail.com',
                    to: 'sharma.14shivani@gmail.com',
                    subject: 'User Password',
                    text: 'Your email id is : '+user_data.email+ ' Your Password is : '+user_data.password
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                });
                return res.status(200).json({
                    message: 'User added successfully!',
                    user   : data,
                    status: 'ok'
                });
            }).catch(function(err){
                return res.status(400).json({
                    message: 'Error adding user!'
                });
            }); 
        }   
    }).catch(function(err){
        res.send(err);
    });
}

function editUserData(req,res){
    var id = req.params.id;

    var user_data = new Object();
    user_data.email    = req.body.email;
    user_data.username    = req.body.username;
    user_data.firstName    = req.body.firstName;
    user_data.lastName    = req.body.lastName;
    user_data.created_at = new Date();

    User.forge({id:id}).fetch().then(function(user){
        if(user){
            User.forge({id:id}).save(user_data).then(function(data){
                return res.status(200).json({
                    message: 'User edited successfully!',
                    user   : data,
                    status: 'ok'
                });
            }).catch(function(error){
                return res.status(400).json({
                    message: 'Error editing user!'
                });
            });
        }
        else{
            return res.status(400).json({
                message: 'No user found with this id!',
                user   : null
            });
        }
    }).catch(function(error) { 
        res.status(404).json({
            status: 'not ok',
            message: 'Error in finding user id.'
        });
    });
}

function getUserData(req,res){
    User.fetchAll().then(function(data){
        res.json({status: 'ok',user:data});
    }).catch(function(error) { 
        res.status(404).json({
            status: 'not ok',
            message:'No user found in the database!',
            data: null
        });
    });
}


module.exports = router;