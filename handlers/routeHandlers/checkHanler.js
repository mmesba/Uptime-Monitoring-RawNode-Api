/*
 * Title: Check Handler File.
 * Description: Check Handler File for check route.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 17/10/2021
 */
 
// Dependencies.
const {maxChecks} = require('../../helpers/environments')
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const data = require('../../lib/data'); 
const tokenHandler = require('./tokenHandler');


 
// App object or Module scaffolding.
 const handler = {}
// main functions or objects.
 handler.checkHandler = (requestProperties, callback)=>{
     // Check which method is requested by user and response according to that
     const acceptedMethods = ['get', 'post', 'put', 'delete'];
     if (acceptedMethods.indexOf(requestProperties.method) > -1) {
       // Call the corresponding method
       handler._check[requestProperties.method](requestProperties, callback)
     } else {
         callback(405)
     }
 }

  handler._check = {}
 
  handler._check.post = (requestProperties, callback)=>{
    // Validate inputs
    let protocol = typeof(requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof(requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof(requestProperties.body.method) === 'string' && ['GET' , 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof(requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof(requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds ) {
      // Validate the token to save any check
      let token = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

      // Lookup the user phone by reading the token
      data.read('tokens', token, (err1, tokenData)=>{
        if (!err1 && tokenData) {
          let userPhone = parseJSON(tokenData).phone;

          // Lookup the user data
          data.read('users', userPhone, (err2, userData)=>{
            if (!err2 && userData) {
              // Verify the token is valid or not .
              tokenHandler._token.verify(token, userPhone, (tokenIsValid)=>{
                if (tokenIsValid) {
                  let userObject = parseJSON(userData);
                  let userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                  if (userChecks.length < maxChecks ) {
                    let checkId = createRandomString(20);
                    // Prepare the final check object
                    let checkObject = {
                      'id': checkId,
                      userPhone,
                      protocol,
                      url,
                      method,
                      successCodes,
                      timeoutSeconds
                    }

                    // Save the objects
                    data.create('checks', checkId, checkObject, (err3)=>{
                      if (!err3) {
                        // Add check id to the user's object
                        userObject.checks = userChecks;
                        userObject.checks.push(checkId);

                        // Save the new user data
                        data.update('users', userPhone, userObject, (err4)=>{
                          if (!err4) {
                              // Return data about new checks
                              callback(200, checkObject)
                          } else {
                            callback(401, {
                              error: 'Server error to update user check'
                            })
                          }
                        })
                      } else {
                        callback(500, {
                          error: 'There was a problem in server side'
                        })
                      }
                    })
                  } else {
                    callback(401, {
                      error: 'User has already reached max checks limit'
                    })
                  }
                } else {
                  callback(403, {
                    error: 'Authentication Failure!'
                  })
                }
              })
            } else {
              callback(403, {
                error: 'user not found!'
              })
            }
          })
        } else {
          callback(403, {
            error: 'Authentication failure~!'
          })
        }
      })
      
    } else{
      callback(400, {
        error: 'You have a problem in your request!'
      })
    }
  }

  handler._check.get = (requestProperties, callback)=>{

  }
 
  handler._check.put = (requestProperties, callback)=>{

}

handler._check.delete = (requestProperties, callback)=>{
      
}
 
 
// export the module.
 module.exports = handler;