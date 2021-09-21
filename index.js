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
const environment = require('./helpers/environments')

// TODO: testing crud (remove later);
// const data = require('./lib/data')

// data.create('test', 'myFile3',  {name: 'Bangladesh', capital: 'dhaka'}, (err)=>{
//     console.log(`Error was`, err);
// } )

// data.read('test', 'myFile', (err, data)=>{
//     console.log(err, data);
// })

// data.update('test', 'myFile', 'new updated file', (err)=>{
//     console.log(err);
// })

// data.delete('test', 'myFile', (err)=>{
//     console.log(err);
// })

// App object or Module scaffolding.
const app = {}; 


// main functions or objects.
// Create server
app.createServer = ()=>{
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, ()=>{
        console.log(`Listening to port ${environment.port}`);
    })
}
 
// Handle request response
app.handleReqRes = handleReqRes;

// Start the server
app.createServer()
// export the module.
 