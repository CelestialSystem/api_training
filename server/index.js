import server from './server.js';
import passport from 'passport';
import passportLocal from 'passport-local';
import user from '../routes/users.js';
import knex from './database/bookShelf';
import controller from '../controller/userCtrl.js';
const app = server.app;
const passportLocalStrategy = passportLocal.Strategy;
app.use(passport.initialize());
app.use((req, res, next) => {
    next();
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        message: error.message || 'Internal Server Error',
        code: error.status,
    });
});
const dataConfig = controller(knex);
app.use('/user',user(server.routes, dataConfig)) 
// app.use('/login',require('../routes/login.js'))
// app.use('/logout',require('../routes/logout.js'))
// app.use('/auth',require('../routes/auth.js'))