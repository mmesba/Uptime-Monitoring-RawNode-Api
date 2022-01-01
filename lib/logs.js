/*
 * Title: Logger library for API.
 * Description: Project's logger related file. 
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mmesba
 * Date: 01/01/2022
 */
 
// Dependencies.
const fs = require('fs');
const path = require('path');
 
// App object or Module scaffolding.
 const lib = {};
// main functions or objects.
//  Define base dir
lib.baseDir = path.join(__dirname, '../.logs/');

// Append a string to a file. Create   the file if it does not exist.
lib.append = (file, str, callback)=>{
    // Open the file for appending
    fs.open(lib.baseDir+file+'.log', 'a', (err, fileDescriptor)=>{
    if (!err && fileDescriptor) {
             // Append to the file and close it
        fs.appendFile(fileDescriptor, str+'\n', (err)=>{
            if (!err) {
                fs.close(fileDescriptor, (err)=>{
                    if (!err) {
                        callback(false);
                      } else {
                         callback('Error closing file!')
                     }
                }) 
              } else {
                 callback('Error appending to file')
             }
             }) 
            }else {
         callback('Could not open file for appending')
     }
        })

}
 

// List all the logs, and optionally include compressed files.
lib.list = (includeCompressedLogs, callback)=>{
    fs.readdir(lib.baseDir, (err, data)=>{
        if (!err && data && data.length >0) {
            let trimmedFileNames = [];
            data.forEach((fileName)=>{
                // Add the .log files
                if (fileName.indexOf('.log') > -1) {
                     trimmedFileNames.push(fileName.replace('.log', ''))
                  } else {
                     callback(err);
                 }
            }) 
          } else {
             callback(err, data)
         }
    })
}
 
 
// export the module.
 module.exports = lib;