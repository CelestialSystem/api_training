const User = require('../models/user.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
// const jwt = require('jsonwebtoken');
var generator = require('generate-password');
var secret_key = require('./../../middleware/passport.js');
var message = require('../../config/language_message.js');
const jwt = require('jwt-simple');
var mailer = require('../../config/mailer.js');


// api for user register in which email id and password will be taken as body params
router.post('/register', function(req, res) {
    if(req.body.email==undefined || req.body.username==undefined){
        return res.status(400).json({
            message: message.empty_validate,
            status: message.status_false
        });
    }
    else{ 
        // var hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);
    
        User.forge({email:req.body.email}).fetch().then(function(rows){
            if (rows) {
                return res.json({status:message.status_false, message:message.register_validate});
            } else {
                // if there is no user with that email then create the user
                var newUserMysql = new Object();
                newUserMysql.email    = req.body.email;
                newUserMysql.username    = req.body.username;
                newUserMysql.password = generator.generate({
                    length: 10,
                    numbers: true
                });
                
                User.forge(newUserMysql).save().then(function(data){
                    // send system generated password mail to user who is registering himself 
                    var text = 'Your email id is : '+data.attributes.email+ ' Your Password is : '+data.attributes.password;
                    mailer.send_email('sharma.14shivani@gmail.com', 'Registration Password', text);
                    res.json({
                        message: 'Email Sent',
                        status: message.status_true,
                        user: data
                    });
                }).catch(function(err){
                    return res.status(400).json({
                        message: err
                    });
                }); 
            }   
        }).catch(function(er){
            return res.json({
                message: er
            });
        });
    }
});


// api for user login by using jwt stategy in which user's email and password needs to be send as body params 

router.post("/login", function(req, res) {
    if(req.body.email && req.body.password){
      var email = req.body.email;
      var password = req.body.password;
    }
    User.forge({email: email}).fetch().then(function(user) {
        if(!user){
            res.status(401).json({message:message.incorrect_email});
        }
        if(password == user.attributes.password){
            // var payload = {id: user.attributes.id};

            // var token = jwt.sign(payload, secret_key, { expiresIn: 60 * 60 });

            // User.forge(payload).save({jwt_token:token, loginTime:new Date()},{patch:true}).then(function(t_data){
            //     res.json({message: "User successfully login", token: t_data});
            // }).catch(function(err){
            //     res.json({message:'Error saving token ',err});
            // });

            var randomString = function() {
                var length = 6 ;  // Random String character length
                var chars = process.env.RND_STRING;
                var resultString = '';
                for(var i = length;i > 0; --i){
                  resultString += chars[Math.floor(Math.random() * chars.length)];    
                }
                return resultString;
            };
            
            var JWTString = randomString();

            user.save({
                random_jwt: JWTString
            }).then(() => {
                var token = jwt.encode(user.pick('id','email','random_jwt'), secret_key);
                var final_token = `Bearer ${token}`;

                User.where({id:user.attributes.id}).fetch().then(function(u_data){
                    u_data.save({'jwt_token':final_token}).then(function(){
                        res.json({message: message.success_login, token: final_token});
                    });
                }).catch(function(er){
                    res.json({message: er});
                });
            });
        }
        else{
            res.status(401).json({message:message.incorrect_password});
        }
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

router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));
  
router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
});


// demo api to check user authentication using jwt strategy

router.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    res.json({"msg":"Success! You can not see this without a token",user:req.user});
});

router.post("/adduser", passport.authenticate('jwt', { session: false }), addUserData);
router.post("/edituser/:id", passport.authenticate('jwt', { session: false }), editUserData);
router.get("/deleteuser/:id", passport.authenticate('jwt', { session: false }), deleteUserData);
router.get("/getuser", passport.authenticate('jwt', { session: false }), getAllUsers);
router.get("/getuserbyid/:id", passport.authenticate('jwt', { session: false }), getUserById);

// used to insert the user in the database by going through jwt authentication
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
            return res.json({status:message.status_false, message:message.register_validate});
        } else {
            // if there is no user with that email then add the user
            
            User.forge(user_data).save().then(function(data){
                var text = 'Your email id is : '+data.attributes.email+ ' Your Password is : '+data.attributes.password;
                mailer.send_email('sharma.14shivani@gmail.com', 'User Password Mail', text);
                res.json({
                    message: 'Email Sent',
                    status: message.status_true,
                    user: data
                });
            });
        }   
    });
}

// used to edit the user in the database by going through jwt authentication
function editUserData(req,res){
    var id = req.params.id;

    var user_data = new Object();
    user_data.email = req.body.email;
    user_data.username = req.body.username;
    user_data.firstName = req.body.firstName;
    user_data.lastName = req.body.lastName;
    user_data.created_at = new Date();

    User.forge({id:id}).fetch().then(function(user){
        if(user){
            User.forge({id:id}).save(user_data).then(function(data){
                return res.status(200).json({
                    message: message.user_edit,
                    user   : data,
                    status: message.status_true
                });
            });
        }
        else{
            return res.json({
                message: message.not_found
            });
        }
    });
}

// used to delete the user from the database by going through jwt authentication
function deleteUserData(req,res){
    var id = req.params.id;

    User.forge({id:id}).fetch().then(function(u_data){
        if(u_data){
            u_data.destroy().then(function(){
                res.json({status: message.status_true, message: message.data_delete});
            });
        }
        else{
            res.json({status: message.status_false, message: message.not_found});
        }
    });
}

// used to fetch all the users from the database by going through jwt authentication
function getAllUsers(req,res){
    User.fetchAll().then(function(u_data){
        res.json({status: message.status_true, user:u_data});
    });
}

// used to fetch the user by their id from the database by going through jwt authentication
function getUserById(req,res){
    var id = req.params.id;
    User.forge({id:id}).fetch().then(function(u_data){
        if(u_data){
            res.json({status: message.status_true, user:u_data});
        }
        else{
            res.json({message: message.not_found});
        }
    });
}


module.exports = router;