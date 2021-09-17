/*
 * Title: Not Found Handler Route.
 * Description: Not Found Handler Route(404 status code),
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 17/09/2021
 */
 
// Dependencies
 
 
// App object or Module scaffolding.
 const handler = {};

// main functions or objects.
 handler.notFoundHandler = (requestProperties , callback)=>{
     callback(404, {
         message: 'Your requested URL was not found'
     })
 }
 
 
 
// export the module.
 module.exports = handler;