module.exports = function (router, dataConfig) {
    router.route('/').get(function (req, res) {
        console.log("inside users route");
        dataConfig.getAllUsers(req, res, function (result, err) {
            if (err) {
                return next(err);
            }
            res.send({ data: result, status: 200, message: 'success' })
        })
    });
    router.route('/getUsers').get(function (req, res, next) {

    });
    router.route('/getUsers:id').get(function (req, res, next) {

    });
    router.route('/createUsers').post(function (req, res, next) {

    });
    router.route('/updateUsers:id').put(function (req, res, next) {

    });
    router.route('/deleteUsers').delete(function (req, res, next) {

    });
    return router;
};