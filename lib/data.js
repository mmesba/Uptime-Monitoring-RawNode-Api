/*
 * Title: Data Related File.
 * Description: CRUD handling data file to deal with file system.
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 21/09/2021
 */
 
// Dependencies.
const fs = require('fs');
const path = require('path') 
 
// App object or Module scaffolding.
 const lib = {};
// main functions or objects.
 // base directory of the data folder
 lib.baseDir = path.join(__dirname, "../.data/");

 // Write data to file
 lib.create = function (dir, file, data, callback) {
     // Open file for writing
     fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', (err1, fileDescriptor)=>{
         if(!err1&& fileDescriptor){
            // Convert data to string
            const stringData = JSON.stringify(data);
            // Write data to file and close it
            fs.writeFile(fileDescriptor, stringData, (err2)=>{
                if (!err2) {
                    fs.close(fileDescriptor, (err3)=>{
                        if(!err3){
                            callback(false);
                        }else{
                            callback('Error closing the new file!')
                        }
                    })
                } else {
                 callback('Error writing to new file!')   
                }
            })
         }else{
             callback('Cannot create file, already exist!')
         }
     })
 }
 
 // Read Data From File
 lib.read = (dir, file, callback)=>{
     fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf-8', (err1, data)=>{
         callback(err1, data);
     })
 }
 
// export the module.
 module.exports = lib;