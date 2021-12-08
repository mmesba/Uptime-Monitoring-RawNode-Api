/*
 * Title: Project Server File.
 * Description: Project Server File for API.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 08/12/2021
 */
 
// Dependencies.
 const http = require('http');
const {handleReqRes} = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');


// App object or Module scaffolding.
const server = {}; 


// main functions or objects.
// Create server
server.createServer = ()=>{
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, ()=>{
        console.log(`Listening to port ${environment.port}`);
    })
}
 
// Handle request response
server.handleReqRes = handleReqRes;

// Start the server
server.init = ()=>{
    server.createServer();
}
// export the module.
 module.exports = server