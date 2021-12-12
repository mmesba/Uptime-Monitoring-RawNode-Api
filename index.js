/*
 * Title: Uptime Monitoring Api
 * Description: Uptime Monitoring real time api with raw node js
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 23/08/2021
 */
 
// Dependencies.
const server = require('./lib/server');
const worker = require('./lib/worker');

// App object or Module scaffolding.
const app = {}
// main functions or objects.
app.init = ()=>{
    // Start the server
    server.init()
    // Start the worker 
    worker.init();
};

app.init();


// export the module.
 module.exports = app