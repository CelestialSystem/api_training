module.exports = function (router, passwordGenerator, nodeMailer, dataConfig) {
    router.route('/verify').post(function (req, res, next) {
        let smtpTransport = nodeMailer.createTransport({
            service: "Gmail",
            auth: {
                user: "testproject.node1@gmail.com",
                pass: "test_admin"
            }
        });


        link = "http://" + req.get('host') + "/auth/signup/register/:email=" + req.body.email+"/:userName=" + req.body.userName;
        mailOptions = {
            to: "testproject.node1@gmail.com",
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        }
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                res.send("error");
            } else {
                console.log("Message sent: " + response);
                res.send("sent and message : " + response);
            }
        });
    })
    router.route('/register/:email/:userName').get(function (req, res, next) {
        let random = Math.floor((Math.random() * 15) + 4);
        let password = passwordGenerator(random, false);
        let user_data = {
            email: req.query.email,
            user_name: req.query.userName,
            password: password
        }
        dataConfig.createValidUser(user_data, function (result, err) {
            if (err) {
                return next(err);
            }
            res.send({ data: result, status: 200, message: 'success' })
        })
    })
    return router;
}