const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));

app.use(passport.initialize());
app.use(passport.session());

const userController = require('./apis/users/users_controller.js');

app.use('/user', userController);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
    console.log('Listening on port 3000.');
});

module.exports = app;
