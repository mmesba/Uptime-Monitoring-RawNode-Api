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
    const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {
      // lookup the check
      data.read('checks', id, (err1, checkData)=>{
        if (!err1 && checkData) {
          const token = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

          tokenHandler._token.verify(token, parseJSON(checkData).userPhone , (tokenIsValid)=>{
            if (tokenIsValid) {
              callback(200, parseJSON(checkData));
            } else {
              callback(403, {
                error: 'Authentication failure!'
              })
            }
          })
        } else {
          callback(500, {
            error: 'There was a problem in server side!'
          })
        }
      })
    } else {
      callback(400, {
        error: 'You have a problem in your request!'
      })
    }
  }
 
  handler._check.put = (requestProperties, callback)=>{
    const id = typeof(requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;


    // Validate inputs
    let protocol = typeof(requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof(requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof(requestProperties.body.method) === 'string' && ['GET' , 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof(requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof(requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (id) {
      if (protocol || url || method || successCodes || timeoutSeconds) {
        data.read('checks', id, (err1, checkData)=>{
          if (!err1 && checkData) {
            let checkObject = parseJSON(checkData);
            const token = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
            tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid)=>{
              if (tokenIsValid) {
                if (protocol) {
                  checkObject.protocol = protocol;
                } 
                if (url) {
                  checkObject.url = url;
                }
                if (method) {
                  checkObject.method = method;
                }
                if (successCodes) {
                  checkObject.successCodes = successCodes;
                }
                if (timeoutSeconds) {
                  checkObject.timeoutSeconds = timeoutSeconds;
                }
                // Store the updated check object
                data.update('checks', id, checkObject, (err2)=>{
                  if (!err2) {
                    callback(200, {
                      checkObject
                    })
                  } else {
                    callback(500, {
                      error: 'There was a problem in server side!'
                    })
                  }
                })
              } else {
                callback(403, {
                  error: 'Authentication failure!'
                })
              }
            })
          } else {
            callback(500, {
              error: 'There was a problem in the server side!'
            })
          }
        })
      }else{
        callback(400, {
          error:"You must provide at least one field to update!"
        })
      }
    } else {
      callback(400, {
        error: 'You have a problem in your request!'
      })
    }

}

handler._check.delete = (requestProperties, callback)=>{
  const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
   

      if (id) {
        // Lookup the check 
        data.read('checks', id, (err1, checkData)=>{
          if (!err1 && checkData) {
            const token = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

            tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid)=>{
              if (tokenIsValid) {
                // Delete the check data
                data.delete('checks', id, (err2)=>{
                  if (!err2) {
                    // Remove the checks instance from user data;
                    data.read('users', parseJSON(checkData).userPhone, (err3, userData)=>{
                      let userObject = parseJSON(userData)
                      if (!err3 && userData) {
                        let userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : []; 
                        // remove the deleted check id from user checks
                        let checkPosition = userChecks.indexOf(id);
                        if (checkPosition > -1) {
                          userChecks.splice(checkPosition, 1);
                          // update the user data
                          userObject.checks = userChecks;
                          data.update('users', userObject.phone, userObject, (err4)=>{
                            if (!err4) {
                              callback(200, {
                                message: 'Check deleted successfully!'
                              })
                            } else {
                              callback(500 , {
                                error: 'There was a problem in server side!'
                              })  
                            }
                          })
                        } else {
                          callback(500, {
                            error: 'Check id that you are trying to remove is not found in user!'
                          })
                        }
                      } else {
                        callback(500, {
                          error: 'There was a problem in server side!'
                        })
                      }
                    })
                  } else {
                    callback(500, {
                      error: 'There was a problem in server side!'
                    })
                  }
                })
              } else {
                callback(403, {
                  error: 'Authentication failure!'
                })
              }
            })

          } else{
            callback(400, {
              error: 'You have a problem in your request!f'
            })
          }
        })
      } else {
        callback(400, {
          error: 'You have a problem in your request!'
        })
      }
}
 
 
// export the module.
 module.exports = handler;