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
 
// Update Data From File
lib.update = (dir, file, data, callback)=>{
    // Open file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', (err1, fileDescriptor)=>{
        if(!err1&&fileDescriptor){
            // Convert the data to string
            const stringData = JSON.stringify(data);
            // Truncate the file
            fs.ftruncate(fileDescriptor, (err2)=>{
                if(!err2){
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err3)=>{
                        if(!err3){
                            // close the file
                            fs.close(fileDescriptor, (err4)=>{
                                if(!err4){
                                    callback(false); 
                                }else{
                                    callback('Error closing file!')
                                }
                            })
                        }else{
                            callback('Error writing to file!')
                        }
                    })
                }else{
                    callback('Error truncating file!');
                }
            })
        }else{
            callback('Error updating. File may not exist!');
        }
    })
}

// Delete existing file
lib.delete = (dir, file, callback)=>{
    // Unlink file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', (err)=>{
        if(!err){
            callback(false)
        }else{
             callback('Error deleting file!')
        }
    })
}


// List all the items in a directory
lib.list = (dir, callback)=>{
    fs.readdir(lib.baseDir+dir+'/', (err, fileNames)=>{
        if (!err && fileNames && fileNames.length > 0) {
            let trimmedFileNames = [];
            fileNames.forEach(fileName => {
                trimmedFileNames.push(fileName.replace('.json', ''))
            });
            callback(false, trimmedFileNames)
        }else{
            callback(`error reading data!`)
        }
    })
}

// export the module.
 module.exports = lib;