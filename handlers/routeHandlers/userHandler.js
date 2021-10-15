/*
 * Title: User Handler Route.
 * Description: User Handler Route to handle user data and many more.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque/Uptime-Monitoring-RawNode-Api
 * Date: 23/09/2021
 */
 
// Dependencies.
 const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities')
const {parseJSON} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler')
 
// App object or Module scaffolding.
const handler = {};
 
// main functions or objects.
 handler.userHandler = (requestProperties, callback)=>{
    // Check which method is requested by user and response according to that.
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        // Call the corresponding method defined below.
        handler._users[requestProperties.method](requestProperties, callback);
    }else{
        callback(405)
    }
 }
 
 //
 handler._users = {};

handler._users.post = (requestProperties, callback)=>{
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName  : false;

    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that user doesn't already exists or not;
        data.read('users', phone, (err1, user)=>{
            if (err1) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                };
                // store the user to database
                data.create('users', phone, userObject, (err2)=>{
                    if (!err2) {
                        callback(200, {
                            message: 'User created successfully!'
                        })
                    } else{
                        callback(500, {
                            error: 'Could not create user'
                        })
                    }
                })
            }else{
                callback(500, {
                    error: 'There was a problem in server side'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in your request!'
        })
    }
};

handler._users.get = (requestProperties, callback)=>{
    // Check the phone number existed in database
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    
    if (phone) {
        // Token Verifier Checkpoint
        const token = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if (tokenId) {
                        // If requested phone existed then Lookup the user details
        data.read('users', phone, (err, user)=>{
            // Parse string user data from  database and give user valid object.
            const userData = {...parseJSON(user)};
            if (!err && user) {
                // Removing password  before data to user
                delete userData.password;
                callback(200, userData);
            }else{
                callback(404, {
                    error: 'Requested data not found'
                })
            }
        })
            } else {
                callback(403, {
                    error: 'Authentication failure!'
                })
            }
        })


    }else{
        callback(404, {
            error: 'Requested user is not found!'
        })
    }
}

handler._users.put = (requestProperties, callback)=>{
    // Check the phone number is valid and proceed..
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    
    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName  : false;
    
    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    
    if (phone) {
        if (firstName || lastName || password) {

              // Token Verifier Checkpoint
        const token = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if (tokenId) {
                        // If requested phone existed then Lookup the user details
                           // Match the provided phone with database
                data.read('users', phone, (err1, uData)=>{
                    // Parse raw json into valid object then manipulate. Because we cannot modify rew JSON.
                    const userData = {...parseJSON(uData)}
                    if (!err1 && userData) {
                        if (firstName) {
                            userData.firstName = firstName;
                        }                    
                        if (lastName) {
                            userData.lastName = lastName;
                        }
                        if (password) {
                            userData.password = hash(password);
                        }
                    
                    // Update user data and save to database
                    data.update('users', phone, userData, (err2)=>{
                        if (!err2) {
                            callback(200, {
                                message:'User updated successfully!'
                            })
                        } else{
                            callback(500, {
                                error: 'There was a problem in server side'
                            })
                        }
                    })
                }else{
                    callback(400,{
                        error: 'You have a problem in your request!'
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
                error: 'You have a problem in your request!'
            })
        }
    }else{
        callback(400, {
            error: 'Invalid Phone number, please try again!'
        })
    }
}

handler._users.delete = (requestProperties, callback)=>{
    // Check the phone number existed in database
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    
    // If phone is valid then proceed otherwise throw error
    if (phone) {

            // Token Verifier Checkpoint
            const token = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

            tokenHandler._token.verify(token, phone, (tokenId)=>{
                if (tokenId) {
                            // If requested phone existed then Lookup the user details
                            // Lookup the user based on valid phone
        data.read('users', phone , (err1, userData)=>{
            if (!err1 && userData) {
                data.delete('users', phone, (err2)=>{
                    if (!err2) {
                        callback(200, {
                            message: 'User Deleted Successfully!'
                        })
                    }else{
                        callback(500, {
                            error: 'There was a server side error!'
                        })
                    }
                })
            }else{
                callback(500, {
                    error: 'There was a server side problem!'
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
            error: 'There was a problem in your request!'
        })
    }
}

// export the module.
module.exports = handler;
