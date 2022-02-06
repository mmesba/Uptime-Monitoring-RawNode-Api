/*
 * Title: Request Response Handler file.
 * Description: Request Response Handler file for project
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/Mohammad-Mesbaul-Haque/Uptime-Monitoring-RawNode-Api.git
 * Date: 17/09/2021
 */
 
// Dependencies.
const url = require('url'); 
const {StringDecoder } = require('string_decoder');
 const routes = require('../routes');
const {notFoundHandler} = require('../handlers/routeHandlers/notFoundHandler')
const {parseJSON} = require('../helpers/utilities')
// App object or Module scaffolding.
 const handler = {};
// main functions or objects.
 handler.handleReqRes = (req, res)=>{
    // handle request
    //get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;


    // Make a request property object and pass it through url
    const requestProperties = {
        parsedUrl, 
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject
    }
    
    // receiving payload from client side

    const decoder = new StringDecoder('utf-8');
    let realData = '';
    
    // Chose which endpoint will fire
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;


    req.on('data', (buffer)=>{
        realData += decoder.write(buffer);
    });

    req.on('end', ()=>{
        realData += decoder.end();

        //Attach real data with request properties body
        // Parse JSON function will prevent crushing from invalid data posting from clients.
        requestProperties.body = parseJSON(realData);

        // Call the chosen handler
        chosenHandler(requestProperties, (statusCode, payload, contentType)=>{

            // Determine the type of response (fallback to JSON)
            contentType = typeof(contentType) == 'string'  ? contentType : 'json';

            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // Return the response parts that are content-specific
            let payloadString = '';
            if(contentType == 'json'){
            res.setHeader('Content-Type', 'Application/json');
            payload = typeof(payload) === 'object' ? payload : {};
            payloadString = JSON.stringify(payload);

            }
            if(contentType == 'html'){
            res.setHeader('Content-Type', 'text/html');
            payloadString = typeof(payload) == 'string' ? payload : '';

            }

            // Return the response parts that are common to all content types
            res.writeHead(statusCode);
            res.end(payloadString)

        })

    })

}
 
 
 
// export the module.
module.exports = handler;
 