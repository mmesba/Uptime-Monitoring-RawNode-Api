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
const zlib = require('zlib');
 
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

                //  Add on the .gz files
                if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs){
                    trimmedFileNames.push(fileName.replace('.gz.b64', ''))
                }

            }) 

            // Return the callback
            callback(false, trimmedFileNames)

          } else {
             callback(err, data)
         }
    })
}
 
 
// Defining log compress function 
// compress the contents of one .log file into a .gz file 
lib.compress = (logId, newFileId, callback)=>{
    let sourceFile =  logId+'.log'
    let destFile = newFileId+'.gz.b64';

    // Read the source file
    fs.readFile(lib.baseDir+sourceFile, 'utf-8', (err, inputString)=>{
        if (!err && inputString) {
            // Compress the data using gzip
            zlib.gzip(inputString, (err, buffer)=>{
                if (!err && buffer) {
                    // Send the compressed data to the destination file
                    fs.open(lib.baseDir+destFile, 'wx', (err, fileDescriptor)=>{
                        if (!err && fileDescriptor) {
                            // Write to the destination file
                            fs.writeFile(fileDescriptor, buffer.toString('base64'), (err)=>{
                                if (!err) {
                                    // Close the destination file
                                    fs.close(fileDescriptor, (err)=>{
                                        if (!err) {
                                            callback(false); 
                                          } else {
                                             callback(err)
                                         }
                                    }) 
                                  } else {
                                     callback(err)
                                 }
                            }) 
                          } else {
                             callback(err)
                         }
                    }) 
                  } else {
                     callback(buffer)
                 }
            }) 
          } else {
             callback(err)
         }        
        })
    }



// Truncate a log file
lib.truncate = (logId, callback)=>{
    fs.truncate(lib.baseDir+logId+'.log', 0, (err)=>{
        if (!err) {
            callback(false); 
          } else {
             callback(err)
         }
    })
}



// export the module.
 module.exports = lib;