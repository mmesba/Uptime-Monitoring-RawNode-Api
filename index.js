/*
 * Title: Uptime Monitoring Api
 * Description: Uptime Monitoring real time api with raw node js
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 23/08/2021
 */
 
// Dependencies.
 const http = require('http');
const url = require('url'); 
const {StringDecoder } = require('string_decoder');
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
app.handleReqRes = (req, res)=>{
    // handle request
    //get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    
    // receiving payload from client side

    const decoder = new StringDecoder('utf-8');
    let realData = '';
    req.on('data', (buffer)=>{
        realData += decoder.write(buffer);
    });

    req.on('end', ()=>{
        realData += decoder.end();

        // Response handle
        res.end('Hello World')

        console.log(realData);
    })
}

// Start the server
app.createServer()
// export the module.
 