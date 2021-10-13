/*
 * Title: Token Handler File.
 * Description: Token Handler File to Generate Tokens and Verify User Requests.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 04/10/2021
 */
 
// Dependencies.
 const data = require('../../lib/data');
 const {hash, createRandomString, parseJSON} = require('../../helpers/utilities');

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
 handler._token.post = (requestProperties, callback)=>{
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;


     // Check if the phone and pass combination is valid
     if (phone && password) {
         data.read('users', phone, (err1, uData)=>{
             let userData = parseJSON(uData)
            let hashedPassword = hash(password);
            if (hashedPassword === userData.password) {
                let tokenId = createRandomString(20);
                let expires = Date.now() + (60 * 60 * 1000);
                // Make a token object and pass it;
                const tokenObject = {phone,
                'id': tokenId,
                expires}
                    // Store the token
                    data.create('tokens', tokenId, tokenObject, (err2)=>{
                        if (!err2) {
                            callback(200, {
                                tokenObject
                            })
                        }else{ callback(500, {
                            error: 'There was a problem in the server side !'
                        })
                    }
                    })
            }else{
                callback(400, {
                    error: 'Password is not valid!'
                })
            }
         })
     } else{
         callback(400, {
             error: 'You have a problem in your request!'
         })
     }
 };

 // Read Token
 handler._token.get = (requestProperties, callback) =>{
   // Check the token id is valid or not
   const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

   if (id) {
       // Lookup the token
       data.read('tokens', id, (err, tokenData)=>{
           // Copy the function parameter with parsing the raw data.
           const token = {... parseJSON(tokenData)};
           if (!err && token) {
               callback(200, token)
           }else{
               callback(404, {
                   error: 'Requested token was not found'
               })
           }
       })
   } else{
       callback(404, {
           error:" Requested token is not valid"
       })
   }
 }

 // Update Token
 handler._token.put = (requestProperties, callback)=>{
    const id = typeof(requestProperties.body.id)=== 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    const extend = typeof(requestProperties.body.extend) === 'boolean' && requestProperties.body.extend == true ? true : false;

    // Check if the id and extend property existed
    if (id && extend) {
        // Read token folder and check the validity of token
        data.read('tokens', id, (err1, tokenData)=>{
            let tokenObject = {...parseJSON(tokenData)};
            if(tokenObject.expires > Date.now()){
                // Extend the lifetime of a token or add another 1 hour for token expire.
                tokenObject.expires = Date.now() + (60 * 60 * 1000);
                // Update new data to database;
                data.update('tokens', id, tokenObject, (err2)=>{
                    if (!err2) {
                        callback(200, {
                            message: 'Token Successfully Updated!'
                        })
                    } else {
                        callback(500, {
                            error: 'There was a server side error!'
                        })
                    }
                })
            } else {
                callback(400, {
                    error: 'Token already expired!'
                })
            }
        })
    }else{
        callback(404, {
            error: 'There was a problem in your request!'
        })
    }
 }

 // Delete Token
 handler._token.delete = (requestProperties, callback)=>{
    // Check the token is valid or not
    const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {
        data.read('tokens', id, (err1, tokenData)=>{
            if (!err1 && tokenData) {
                // Delete the token from database
                data.delete('tokens', id, (err2)=>{
                    callback(200, {
                        error: 'Token Deleted Successfully!'
                    })
                })
            } else {
                callback(500, {
                    error: 'There was a server side error!'
                })
            }
        })
    }else{
        error: 'There was a server side error!'
    }
 }
 
 
 
// export the module.
 module.exports = handler