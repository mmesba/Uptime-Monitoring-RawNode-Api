/*
 * Title: Project Server File.
 * Description: Project Server File for API.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 08/12/2021
 */
 
// Dependencies.
 const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const {handleReqRes} = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');


// App object or Module scaffolding.
const server = {}; 


// main functions or objects.
// Create  http server
server.createHttpServer = ()=>{
    const createHttpServerVariable = http.createServer(server.handleReqRes);
    createHttpServerVariable.listen(environment.httpPort, ()=>{
        console.log('\x1b[33m%s\x1b[0m', `Listening to port ${environment.httpPort}`);
    })
}

// Create Https server
// Instantiate the https server options
let httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '../https/cert.pem'))
}

server.createHttpsServer = ()=>{
    const createHttpsServerVariable = https.createServer(httpsServerOptions, server.handleReqRes)
    createHttpsServerVariable.listen(environment.httpsPort, ()=>{
        console.log('\x1b[31m%s\x1b[0m', `Listening to port ${environment.httpsPort}`);
    })
}
 
// Handle request response
server.handleReqRes = handleReqRes;

// Start the server
server.init = ()=>{
    server.createHttpServer();
    server.createHttpsServer();
}
// export the module.
 module.exports = server