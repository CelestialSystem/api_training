const bcrypt = require('bcrypt-nodejs');
const User = require('../apis/users/user.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

var jwtOptions = new Object();
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


// google authentication strategy

passport.use(new GoogleStrategy({
    clientID: '792733349077-6hmut9k86hiecsb4lgpm0ehoiloiir93.apps.googleusercontent.com',
    clientSecret: 'IzBORHvI4MIvNK3o5oFJ8IYl',
    callbackURL: "http://localhost:3000/user/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.forge({ googleId: profile.id }).fetch().then(function (user) {
            //check if user already exists in the database
            if(user){
                // already have the user so update the login time and access token only
                User.forge({id:user.id,googleId: user.googleId}).save({'access_token':accessToken,'loginTime':new Date()}, {patch: true}).then(function(data){
                    console.log('User already found! User Login time updated!');
                    return done(null, data); 
                }).catch(function(er){
                    return done(er);
                });
            }
            else{
                var newUser = new Object();
                            
                // set all of the google information in our user model
                newUser.googleId    = profile.id; // set the users google id                 
                newUser.access_token = accessToken; // we will save the token that google provides to the user                    
                newUser.firstName  = profile.name.givenName;
                newUser.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.email = profile.emails[0].value; // google can return multiple emails so we'll take the first
                newUser.username = profile.displayName;
                newUser.loginTime = new Date();
                
                User.forge({email:profile.emails[0].value}).fetch().then(function(u_data){
                    if(u_data){
                        User.forge({id:u_data.id}).save(newUser, 
                        {patch: true}).then(function(data){
    
                            return done(null, data); 
                        }).catch(function(er){
                            return done(er);
                        });
                    }
                    else{
                        // if there is no user found with that google id, create them

                        User.forge(newUser).save().then(function(u_data) {
                        // if successful, return the new user
                            return done(null, u_data);
                        }).catch(function(error){
                            return done(error);
                        });
                    }
                }).catch(function(er){

                });
            }
            //return done(err, user);
       }).catch(function(err){
            return done(err);
       });
  }
));

module.exports = jwtOptions.secretOrKey;