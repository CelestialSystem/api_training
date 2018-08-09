
import babelRegister from 'babel-register';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
module.exports = (function () {
    const server = {};
    server.routes = express.Router();
    server.app = express();
    server.app.use(bodyParser.json());
    server.app.use(bodyParser.urlencoded({ extended: true }));
    server.app.use(cors())

    server.app.use('/', express.static(__dirname + '../public/login.html'));
    server.app.get('/', (req, res, next) => {
        let pathnow = path.join(__dirname, '../public/login.html');
        res.sendFile(pathnow)
    });
    server.app.listen(process.env.NODE_PORT || 8082);
    console.log("hi in server file");
    return server;
})();

