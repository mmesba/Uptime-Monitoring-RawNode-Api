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
const path = require('path');
const fs = require('fs');
 
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


 // Random string generator function
 utilities.createRandomString = (str) =>{
    let string = str;
    string = typeof(str) === 'number' && str > 0 ? str : false;
    if (string) {
        let possibleCharacter = 'AbcDefGhijkLmnOPqRSTuvwxyz1234567890';
        let output = '';
        for(let i = 1; i <= string; i++){
            let randomCharacter = possibleCharacter.charAt(Math.floor(Math.random() * possibleCharacter.length));
            output += randomCharacter;
        }
        return output;

    }else{
    return false;}
}
 
// Get the string content of a template
utilities.getTemplate = (templateName, callback)=>{
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
    if(templateName){
        let templatesDir = path.join(__dirname, '/../templates/');
        fs.readFile(templatesDir+templateName+'.html', 'utf-8', (err, str)=>{
            if (!err && str) {
                callback(false, str) 
              } else {
                 callback('No template could be found')
             }
        })
    }else{
        callback('A valid template name was not specified')
    }
}



// export the module.
 module.exports = utilities;