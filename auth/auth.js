module.exports = (passport, passportJwt, jwtSimple, bCrypt, dataConfig) => {
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
    passport.use(strategy);
    return {
        token_generation: function (user) {
            return new Promise((success, reject) => {
                dataConfig.checkValidUser(user.email, function (data, err) {
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
