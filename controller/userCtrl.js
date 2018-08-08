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
        checkValidUser: function (email, next) {
            knex.knex('user_data').where({ email: email}).first().then((res) => {
                next(res, null)
            }).catch((err) => {
                console.log("returned err ", err)
                next("", err)
            })
        }
    }
}