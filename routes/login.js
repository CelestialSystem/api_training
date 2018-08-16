
module.exports = function (router, auth) {
    router.route('/login').post(function (req, res, next) {
        if (req.body.email && req.body.password) {
            let user = {
                email: req.body.email,
                password: req.body.password
            }
            auth.token_generation(user).then(result => {
console.log("result: ",result)
                if (result.error && !result.token) {
                    const error = result.error;
                    error.status = 401;
                    error.message = 'User Not Found';
                    return next(error);
                } else {
                    req.logIn(result.token, function (err) {
                        req.token = result.token;
                        req.Authorization = result.token;
                        res.send({ data: { token: result.token }, status: 200, message: 'success' })
                    })
                }
            }).catch(err => {
                const error = new Error('Unknown Error');
                error.status = 500;
                error.message = 'Something went wrong';
                return next(error);
            });
        } else {
            const error = new Error('Empty required fields');
            error.status = 500;
            error.message = 'All fields required';
            return next(error);
        }

    })
    router.get('/google',auth.google_token_generation());
    router.get('/google/callback',auth.google_authenticate(),
        function (req, res) {
            console.log("response in google callback: ",req.user)
            res.redirect('/user/');
        });
    return router;
};