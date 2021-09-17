/*
 * Title: Sample Handler Route
 * Description: Sample Handler Route for application.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 17/09/2021
 */
 
// Dependencies.
 
 
// App object or Module scaffolding.
const handler = {};
 
// main functions or objects.
 handler.sampleHandler = (requestProperties, callback)=>{
     callback(200, {
         message: 'This is a sample url endpoint'
     });
 }
 
 
 
// export the module.
 module.exports = handler;