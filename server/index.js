import server from './server.js';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import jwtSimple from 'jwt-simple';
import bCrypt from 'bcryptjs';
import passGenerator from 'password-generator';
import nodeMailer from 'nodemailer';

import knex from './database/bookShelf';

import user from '../routes/users.js';
import authRoute from '../auth/auth.js';
import login from '../routes/login.js';
import register from '../routes/signUp.js';

import controller from '../controller/userCtrl.js';

const app = server.app;
const passportLocalStrategy = passportLocal.Strategy;
app.use(passport.initialize());
// app.use((req, res, next) => {
//     let error = new Error("404 Not Found!");
//     error.status = 404;
//     error.message = "404 Not Found!";
//     next(error);
// });
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        message: error.message || 'Internal Server Error',
        code: error.status,
    });
});
const dataConfig = controller(knex);
const auth = authRoute(passport, passportJwt, jwtSimple, bCrypt, dataConfig);
app.use('/auth', login(server.routes, auth))
app.use('/auth/signup', register(server.routes, passGenerator, nodeMailer, dataConfig))
app.use('/user', auth.authenticate(), user(server.routes, dataConfig))
// app.use('/logout',require('../routes/logout.js'))
// app.use('/auth',require('../routes/auth.js'))