/*
 * Title: Utilities Related File.
 * Description:Important Utilities Related File of this API.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 24/09/2021
 */
 
// Dependencies.
 
 
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
 }
 
 
 
// export the module.
 module.exports = utilities;