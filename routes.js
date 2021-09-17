/*
 * Title: Routes indicator file.
 * Description: Routes indicator file file for project.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/Mohammad-Mesbaul-Haque/Uptime-Monitoring-RawNode-Api.git
 * Date: 17/06/2021
 */
 
// Dependencies.
 const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
 
// App object or Module scaffolding.

const routes   = {
    'sample': sampleHandler
} 
// main functions or objects.
 module.exports = routes;
 
 
 
// export the module.
 