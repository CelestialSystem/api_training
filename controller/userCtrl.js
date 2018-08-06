module.exports = function (knex) {
    return {
        getAllUsers: function (req, res, next) {
            knex.knex('user_data').then(function (data) {
                console.log("created users: ", data)
                return next(data,null);
            }).catch(err => {
                return next('',err);
            });
        }
    }
}