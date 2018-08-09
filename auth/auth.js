const googleCredential = require('./googleConf');
module.exports = (passport, passportJwt, jwtSimple, bCrypt, GoogleStrategy, dataConfig) => {
    const ExtractJwt = passportJwt.ExtractJwt;
    const Strategy = passportJwt.Strategy;
    let cfg = require('./jwt_conf');
    let params = {
        secretOrKey: cfg.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken
    };
    let strategy = new Strategy(params, function (payload, done) {
        dataConfig.getUserById(payload.id, function (user, err) {
            if (err) {
                return done(err, null);
            }
            if (!user) {
                return done(new Error("User not found"), null);
            } else {
                return done(null, {
                    id: user
                });
            }
        })
    });
    let googleStrategy = new GoogleStrategy({
        clientID: googleCredential.clientID,
        clientSecret: googleCredential.clientSecret,
        callbackURL: googleCredential.callbackURL
    },
        function (token, tokenSecret, profile, done) {
            dataConfig.getGoogleUserById(profile.id, function (user, err) {
                if (err) {
                    return done(err, null);
                }
                if (!user) {
                    dataConfig.insertGoogleUser(profile, token, function (data, err) {
                        if (err) {
                            return done(err, null);
                        }
                        return done(null, { user: data, token: token, message: 'success' })
                    })
                }
                console.log("valid user data: ",user)
                return done(null, { user: user, token: token, message: 'success' });
            })
            // return done(null, profile);
        }
    );
    passport.use(strategy);
    passport.use(googleStrategy);
    return {
        google_token_generation: function () {
            return passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] })
        },
        google_authenticate: function () {
            return passport.authenticate('google', { session: false });
        },
        token_generation: function (user) {
            return new Promise((success, reject) => {
                dataConfig.getUserByMail(user.email, function (data, err) {
                    if (err) {
                        return reject(err);
                    }
                    if (!data) {
                        return success({ token: null, error: new Error("User not found") });
                    } else {
                        // let hashPass = bCrypt.hashSync(user.password, bCrypt.genSaltSync(10), null)
                        // console.log("hashpass: ",hashpass)
                        if (!bCrypt.compareSync(user.password, data.password)) {
                            return success({ token: null, error: new Error("User not found") });
                        }
                        let payload = {
                            id: data.id
                        }
                        let token = jwtSimple.encode(payload, cfg.jwtSecret);
                        return success({ token: token, error: null });
                    }
                })
            })
        },
        authenticate: function () {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};
