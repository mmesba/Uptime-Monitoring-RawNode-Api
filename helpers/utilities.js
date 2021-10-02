/*
 * Title: Utilities Related File.
 * Description:Important Utilities Related File of this API.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 24/09/2021
 */
 
// Dependencies.
 const crypto = require('crypto');
const environments = require('./environments');
 
// App object or Module scaffolding.
 const utilities = {};
// main functions or objects.
 // Parse JSON string to object
 utilities.parseJSON = (jsonString) =>{
     let output;
     try {
         output = JSON.parse(jsonString);
     } catch  {
         output = {};
     }
     return output;
 }
 
 
 // Hashing Function
 utilities.hash = (str)=>{
     if (typeof(str) === 'string' && str.length > 0) {
         let hash = crypto
                        .createHmac('sha256', environments.secretKey)
                        .update(str)
                        .digest('hex');
                        return hash;
     } else{
         return false;
     }
 }
 
// export the module.
 module.exports = utilities;