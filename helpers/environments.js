/*
 * Title: Environment File
 * Description: Environment related config File.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 19/09/2021
 */
 
// Dependencies.
 
 
// App object or Module scaffolding.
const environments = {}
 
// main functions or objects.
environments.staging = {
    port: 3000,
    envName : 'staging',
    secretKey: 'This_is_very_secret, you have to provide your own & this should not be exposed anywhere',
    maxChecks : 5
} 

environments.production = {
    port: 5000,
    envName : 'production',
    secretKey:  'This_is_very_secret, you have to provide your own & this should not be exposed anywhere',
    maxChecks : 5
} 
 
 // Determine which environment was passed.
 const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

 // Export corresponding environment object
 const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

 
// export the module.
 module.exports = environmentToExport