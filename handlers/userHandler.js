/*
 * Title: User Handler Route.
 * Description: User Handler Route to handle user data and many more.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque/Uptime-Monitoring-RawNode-Api
 * Date: 23/09/2021
 */
 
// Dependencies.
 
 
// App object or Module scaffolding.
const handler = {};
 
// main functions or objects.
 handler.userHandler = (requestProperties, callback)=>{
    // Check which method is requested by user and response according to that.
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        
    }else{
        callback(405)
    }
 }
 
 //
 handler._users = {};

handler._users.post = (requestProperties, callback)=>{

};

handler._users.read = (requestProperties, callback)=>{

}

handler._users.put = (requestProperties, callback)=>{

}

handler._users.delete = (requestProperties, callback)=>{

}
 
// export the module.
 module.exports = handler;
 