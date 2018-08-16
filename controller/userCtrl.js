module.exports = function (knex) {
    return {
        getAllUsers: function (req, res, next) {
            knex.knex('user_data').then(function (data) {
                console.log("created users: ", data)
                return next(data, null);
            }).catch(err => {
                return next('', err);
            })
        },
        getUserById: function (id, next) {
            knex.knex.table('user_data').where({ id: id }).first().then((res) => {
                next(res.user_name, null)
            }).catch((err) => {
                console.log("returned err ", err)
                next("", err)
            })
        },
        getUserByMail: function (email, next) {
            knex.knex('user_data').where({ email: email }).first().then((res) => {
                next(res, null)
            }).catch((err) => {
                console.log("returned err ", err)
                next("", err)
            })
        },
        insertUser: function (user_data, next) {
            knex.knex('user_data').insert({
                id: user_data.id,
                user_name: user_data.name,
                email: user_data.email,
                password: user_data.password
            }).then((res) => {
                next(res, null)
            }).catch((err) => {
                console.log("returned err ", err)
                next("", err)
            })
        },
        updateUserByMail: function (user_data, where_clause, next) {
            knex.knex('user_data').where({email: where_clause})
                .update({
                    user_name: user_data.name,
                    email: user_data.email,
                    password: user_data.password
                }).then((res) => {
                    next(res,null)
                }).catch((err) => {
                    next("", err)
                });
        },
        deleteUserByMail: function (user_data, next) {
            knex.knex('user_data')
                .del().where({ email: user_data.email }).then((res) => {
                    console.log(res);
                    next(res,null)
                }).catch((err) => {
                    console.log("returned err ", err)
                    next("", err)
                })
        },
        deleteUserById: function (user_data, next) {
            knex.knex('user_data')
                .del().where({ id: user_data.id }).then((res) => {
                    console.log(res);
                    next(res,null)
                }).catch((err) => {
                    console.log("returned err ", err)
                    next("", err)
                })
        },
        insertGoogleUser: function (user_data, token, next) {
            knex.knex('google_users_new').insert({
                id: 1, name: user_data.displayName, google_mail: user_data.emails[0].value, google_id: user_data.id, google_token: token,
                created_at: Date.now()
            }).then((res) => {
                next(res, null)
            }).catch((err) => {
                console.log("returned err ", err)
                next("", err)
            })
        },
        updateGoogleUser: function (user_data, token, next) {
            knex.knex('user_data').returning('*').where({ google_id: user_data.id }).update({
                id: user_data.id,
                name: user_data.displayName,
                google_mail: user_data.emails[0].value,
                google_id: user_data.id,
                google_token: token,
                created_at: Date.now()
            }).then((res) => {
                next(res, null)
            }).catch((err) => {
                console.log("returned err ", err)
                next("", err)
            })
        },
        getAllGoogleUsers: function (next) {
            knex.knex.select('*').from('google_users_new').then((res) => {
                next(res, null)
            }).catch((err) => {
                console.log("returned err1 ", err)
                next("", err)
            })
        },
        getGoogleUserById: function (googleId, next) {
            knex.knex('google_users_new').where({ google_id: googleId }).first().then((res) => {
                next(res, null)
            }).catch((err) => {
                console.log("returned err1 ", err)
                next("", err)
            })
        },
        deleteGoogleUserByGoogleId: function (next) {
            knex.knex('google_users_new').where({ google_id: googleId }).del().then((res) => {
                next(res, null)
            }).catch((err) => {
                console.log("returned err1 ", err)
                next("", err)
            })
        }
    }
}