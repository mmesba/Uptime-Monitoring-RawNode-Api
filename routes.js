/*
 * Title: Routes indicator file.
 * Description: Routes indicator file file for project.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/Mohammad-Mesbaul-Haque/Uptime-Monitoring-RawNode-Api.git
 * Date: 17/09/2021
 */
 
// Dependencies.
 const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const {userHandler} = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkHanler');
 
// App object or Module scaffolding.

const routes   = {
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler,
    'checkHandler': checkHandler
} 
// main functions or objects.
 module.exports = routes;
 
 
 
// export the module.
 