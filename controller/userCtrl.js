module.exports = function (knex) {
    return {
        getAllUsers: function (req, res, next) {
            knex.knex('user_data').then(function (data) {
                console.log("created users: ", data)
                return next(data, null);
            }).catch(err => {
                return next('', err);
            });
        },
        getUserById: function (id, next) {
            knex.knex('user_data').where({ id: id }).first().then((res) => {
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
        insertGoogleUser: function (user_data,token,next) {
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
        getGoogleUserById:  function (googleId, next) {
            knex.knex('google_users_new').where({ google_id: googleId }).first().then((res) => {
                next(res, null)
            }).catch((err) => {
                console.log("returned err1 ", err)
                next("", err)
            })
        }
    }
}