const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();
const User = require('../apis/users/user.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'my_secret';


// authentication using jwt strategy

passport.use(new JwtStrategy(jwtOptions,function(jwt_payload,done) {
    console.log(jwt_payload);
    User.forge({id: jwt_payload.id}).fetch().then(function(user) {
        if(!user){
            return done(null,false,{message:"Incorrect email!"});
        }
        return done(null, user.attributes, {
            message: 'Logged In Successfully'
        });
    }).catch(function(err){
        return done(err);
    });
}));


// api for user login

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
                var token = jwt.sign(payload, jwtOptions.secretOrKey);
                res.json({message: "ok", token: token});
            }
        });
    }).catch(function(err){
        return err;
    });
  });


module.exports = router;
