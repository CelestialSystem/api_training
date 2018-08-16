// server is server instantiation file
import server from './server.js';
//all require dependencies
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import jwtSimple from 'jwt-simple';
import bCrypt from 'bcryptjs';
import passGenerator from 'password-generator';
import nodeMailer from 'nodemailer';
import googleAuth from 'passport-google-oauth';

// database configurations
import knex from './database/bookShelf';

// routings for add, edit and update users
import user from '../routes/users.js';
// authorization configuration using passport, JWT and Google
import authRoute from '../auth/auth.js';
// importing for sign-in routes
import login from '../routes/login.js';
// importing user registration file
import register from '../routes/signUp.js';
// importing user curd operation file
import controller from '../controller/userCtrl.js';

const app = server.app;
const passportLocalStrategy = passportLocal.Strategy;
const GoogleStrategy = googleAuth.OAuth2Strategy;
// passport initialization
app.use(passport.initialize());

// app.use((req, res, next) => {
//     let error = new Error("404 Not Found!");
//     error.status = 404;
//     error.message = "404 Not Found!";
//     next(error);
// });

// middleware for routing errors handling
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        message: error.message || 'Internal Server Error',
        code: error.status,
    });
});

//database connection: providing database config to execute queries 
const dataConfig = controller(knex);

const auth = authRoute(passport, passportJwt, jwtSimple, bCrypt, GoogleStrategy, dataConfig);
app.use('/auth', login(server.routes, auth))
app.use('/auth/signup', register(server.routes, passGenerator, nodeMailer, dataConfig))
app.use('/user', user(server.routes, dataConfig))
// app.use('/logout',require('../routes/logout.js'))
module.exports = app;