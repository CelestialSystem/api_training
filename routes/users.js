module.exports = function (router, dataConfig) {
    router.route('/').get(function (req, res) {
        dataConfig.getAllUsers(req, res, function (result, err) {
            if (err) {
                return next(err);
            }
            res.send({ data: result, status: 200, message: 'success' })
        })
    });
    
    router.route('/getUsers/:email').get(function (req, res, next) {
        let req_body = req.body;
        dataConfig.getUserByMail(req_body, function (result, err) {
            if (err) {
                return next(err);
            }
            res.send({ data: result, status: 200, message: 'success' })
        })
    });
    router.route('/getUsers/:id').get(function (req, res, next) {
        let req_body = req.body;
        dataConfig.getUserById(req_body, function (result, err) {
            if (err) {
                return next(err);
            }
            res.send({ data: result, status: 200, message: 'success' })
        })
    });
    router.route('/createUsers').post(function (req, res, next) {
        let req_body = req.body;
        req_body['id'] = req.body.id;
        dataConfig.insertUser(req_body, function (result, err) {
            if (err) {
                return next(err);
            }
            res.send({ data: result, status: 200, message: 'success' })
        })
    });
    router.route('/updateUsers/:email').put(function (req, res, next) {
        let req_body = req.body;
        req_body['id'] = req.body.id;
        let where_clause = req.params.email
        dataConfig.updateUserByMail(req_body, where_clause, function (result, err) {
            if (err) {
                return next(err);
            }
            res.send({ data: result, status: 200, message: 'success' })
        })
    });
    router.route('/deleteUserByMail/:email').delete(function (req, res, next) {
        let req_param = req.params;
        dataConfig.deleteUserByMail(req_param, function (result, err) {
            if (err) {
                return next(err);
            }
            res.send({ data: result, status: 200, message: 'success' })
        })
    });
    router.route('/deleteUserById/:id').delete(function (req, res, next) {
        let req_param = req.params;
        dataConfig.deleteUserById(req_param, function (result, err) {
            if (err) {
                return next(err);
            }
            res.send({ data: result, status: 200, message: 'success' })
        })
    });
    return router;
};