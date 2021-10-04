/*
 * Title: Token Handler File.
 * Description: Token Handler File to Generate Tokens and Verify User Requests.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 04/10/2021
 */
 
// Dependencies.
 
 
// App object or Module scaffolding.
 const handler = {}
// main functions or objects.
 handler.tokenHandler = (requestProperties, callback)=>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._token[requestProperties.method](requestProperties, callback);
    } else{
        callback(405);
    }
 }

 handler._token= {};

 // Token Creation
 handler._token.post = (requestProperties, callback)=>{};

 // Read Token
 handler._token.get = (requestProperties, callback) =>{
    callback(200, {
        ok: 'ok'
    })
 }

 // Update Token
 handler._token.put = (requestProperties, callback)=>{

 }

 // Delete Token
 handler._token.delete = (requestProperties, callback)=>{

 }
 
 
 
// export the module.
 module.exports = handler