const User = require('../models/user.js');
const passport = require('passport');
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
        user.get('random_jwt') == jwt_payload.random_jwt ? done(null, user): done(null, false);
    }).catch(function(err){
        return done(err,false);
    });
}));


// google authentication strategy

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
       User.forge({ googleId: profile.id }).fetch().then(function (user) {
            // check if user already exists in the database
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
                
                User.forge({email:newUser.email}).fetch().then(function(u_data){
                    if(u_data){
                        User.forge({id:u_data.id}).save(newUser,{patch:true}).then(function(data){
                            return done(null, data); 
                        });
                    }
                    else{
                        // if there is no user found with that google id, create them
                        User.forge(newUser).save().then(function(u_data) {

                        // if successful, return the new user
                            return done(null, u_data);
                        });
                    }
                });
            }
       }).catch(function(err){
            return done(err);
       });
    }
));

module.exports = jwtOptions.secretOrKey;