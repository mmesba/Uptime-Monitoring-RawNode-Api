/*
 * Title: User Handler Route.
 * Description: User Handler Route to handle user data and many more.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque/Uptime-Monitoring-RawNode-Api
 * Date: 23/09/2021
 */
 
// Dependencies.
 const data = require('../lib/data');
 
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

    if (firstName && lastName && password && tosAgreement) {
        // Make sure that user doesn't already exists or not;
        // ... will be continued....
    } else {
        callback(400, {
            error: 'You have a problem in your request!'
        })
    }
};

handler._users.get = (requestProperties, callback)=>{

}

handler._users.put = (requestProperties, callback)=>{

}

handler._users.delete = (requestProperties, callback)=>{

}
 
// export the module.
 module.exports = handler;
 