
import babelRegister from 'babel-register';
import express from 'express';
// import bodyParser from 'body-parser';
import cors from 'cors';
module.exports = (function(){
    const server = {};
    server.routes = express.Router();
    server.app = express();
    // server.app.use(bodyParser.json());
    // server.app.use('/', express.static(__dirname + '../public/'));
    server.app.listen(process.env.NODE_PORT || 8082);
    console.log("hi in server file");
    return server;
})();

