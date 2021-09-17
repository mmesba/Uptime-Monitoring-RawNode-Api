/*
 * Title: Uptime Monitoring Api
 * Description: Uptime Monitoring real time api with raw node js
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 23/08/2021
 */
 
// Dependencies.
 const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
// App object or Module scaffolding.
const app = {}; 

// Configurations
app.config = {
    port: 3000
}
// main functions or objects.
// Create server
app.createServer = ()=>{
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, ()=>{
        console.log(`Listening to port ${app.config.port}`);
    })
}
 
// Handle request response
app.handleReqRes = handleReqRes;

// Start the server
app.createServer()
// export the module.
 