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
    envName : 'staging'
} 

environments.production = {
    port: 5000,
    envName : 'production'
} 
 
 // Determine which environment was passed.
 const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

 // Export corresponding environment object
 const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

 
// export the module.
 module.exports = environmentToExport