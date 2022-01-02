/*
 * Title: Worker File 
 * Description: Worker file for API
 * Author: Mohammad Mesbaul Haque
 * Github link: https://github.com/mohammad-mesbaul-haque
 * Date: 08/12/2021
 */
 
// Dependencies.
 const data = require('./data');
const {parseJSON} = require('../helpers/utilities')
const url = require('url');
const http = require('http');
const https = require('https');
const { sentTwilioSms } = require('../helpers/notifications');
const _logs = require('./logs')
 
// App object or Module scaffolding.
const worker = {} 
// main functions or objects.
// Lookup all the checks
worker.gatherAllChecks = ()=>{
    // get all the checks
    data.list('checks', (err1, checks)=>{
        if (!err1 && checks && checks.length > 0) {
            checks.forEach(check => {
                // Read the check data  
                data.read('checks', check, (err2, originalCheckData)=>{
                    if (!err2 && originalCheckData) {
                        // Pass the data to the next process or validator
                        worker.validateCheckData(parseJSON(originalCheckData))
                        
                    } else {
                        console.log(`Error: Reading one of the check data`);
                    }
                })
            });
        } else {
            console.log(`Error: Could not find any checks to process`);
        }
    })
}

// Validate individual check data
worker.validateCheckData = (originalCheckData)=>{
    let originalData = originalCheckData;
    if (originalCheckData && originalCheckData.id) {
        originalData.state = typeof(originalCheckData.state) === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';

        originalData.lastChecked = typeof(originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

        // Pass to the next process
        worker.performCheck(originalData);

      } else {
         console.log(`Error: Check was invalid or not properly formatted`)
     }
}

// Perform check
worker.performCheck = (originalCheckData) =>{
    // Prepare the initial check outcome
    let checkOutCome = {
        'error' : false,
        responseCode : false
    };

    // Mark the outcome has not been sent yet
    let outComeSent = false;

    // Parse the  host name and full url from original data
    const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    const hostname = parsedUrl.hostname;
    const { path} = parsedUrl

    // construct the request
    const requestDetails = {
    'protocol' : originalCheckData.protocol + ':',
    // FIXME:This typo cost my 1 hour, I wrote hostName  instead of hostname!!
    hostname,
    'method': originalCheckData.method.toUpperCase(),
    path,
    'timeout' : originalCheckData.timeoutSeconds * 1000,
    }

    // Decide which protocol will be use to send a request
    const protocolToUse  = originalCheckData.protocol === 'http' ? http : https;
    let req = protocolToUse.request(requestDetails, (res)=>{
        // Grab the status code of response
        let status = res.statusCode;
        console.log(status);
        // Update the check outcome and pass to the next process
        checkOutCome.responseCode= status;
        if (!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
        }
    })

    // Listen error event 
    req.on('error' , (e)=>{
            checkOutCome = {
            'error' : true,
            value: e
        };
        // Update the check outcome and pass to the next process
        if (!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    })

    // Listen timeout event 
    req.on('timeout', ()=>{
            checkOutCome = {
            'error' : true,
            value: 'timeout',
        };
        // Update the check outcome and pass to the next process
        if (!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    })
    // Send request
    req.end();
}
// Save check outcome to database and send to next process
    worker.processCheckOutCome = (originalCheckData, checkOutCome)=>{
        // Check if check outcome is up or down
        let state = !checkOutCome.error && checkOutCome.responseCode && originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1 ? 'up' : 'down';

        // Decide we should alert user or not
        let alertWanted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

        // Log the outcome
        // Invoking log function
        let timeOfCheck = Date.now();
        worker.log(originalCheckData, checkOutCome, state, alertWanted, timeOfCheck);





        // Update the check data
        let newCheckData = originalCheckData;
        newCheckData.state = state;
        newCheckData.lastChecked = timeOfCheck;
        // Update the check to database
        data.update('checks', newCheckData.id, newCheckData, (err)=>{
            if (!err) {
                if (alertWanted) {
                    // Send the check data to next process
                    worker.alertUserToStatusChange(newCheckData); 
                } else {
                    console.log(`Alert is not needed , there is no state change`);
                }
              } else {
                 console.log(`Error: trying to save check data of the checks!`)
             }
        } )
        

    }

    // Send notification to user if there any state changes
    worker.alertUserToStatusChange = (newCheckData)=>{
        let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
         
        sentTwilioSms(newCheckData.userPhone, msg, (err)=>{
            if (!err) {
                 console.log(`User was alerted to a status change via sms ${msg}`);
              } else {
                 console.log(`There was a problem sending sms one of the user!`)
             }
        })
    }

//  Define workers log function
worker.log = (originalCheckData, checkOutCome, state, alertWanted, timeOfCheck)=>{
    // Form the log data
    let logData = {
        'check' : originalCheckData,
        'outcome' : checkOutCome,
        'state': state,
        'alert': alertWanted,
        'time' : timeOfCheck
    }

    // Convert data to string
    let logString = JSON.stringify(logData);

    // Determine the name of the log file
    let logFileName = originalCheckData.id;

    // Append the log string to the file
    _logs.append(logFileName, logString, (err)=>{
        if (!err) {
            console.log('Logging to file succeeded'); 
          } else {
             console.log('Logging to file failed!')
         }
    })


}  

// Rotate (compress) the log files
worker.rotateLogs = ()=>{
    // Listing all the (non compressed ) log files
    _logs.list(false, (err, logs)=>{
        if (!err && logs && logs.length > 0) {
            //  Looping through the founded logs
            logs.forEach((logName)=>{
                // Compress the data to a different file
                let logId = logName.replace('.log', '');
                let newFileId = logId+'-'+Date.now();
                _logs.compress(logId, newFileId, (err)=>{
                    if (!err) {
                        //  Truncate the log
                        _logs.truncate(logId, (err)=>{
                            if (!err) {
                                console.log('\x1b[33m%s\x1b[0m', 'Success truncating log files'); 
                              } else {
                                 console.log('Error truncating log files')
                             }
                        })
                      } else {
                         
                     }
                })
            })
          } else {
             console.log('Error Could not found any logs to rotate')
         }
    })
}







    // timer to execute the worker process once per minute
    worker.loop = ()=>{
        setInterval(() => {
            worker.gatherAllChecks();             
        }, 1000);
    }

// Timer to execute the log rotation process once per day.
worker.logRotationLoop = ()=>{
    setInterval(() => {
        worker.rotateLogs();
    }, 6000*10*60*24);
}





    worker.init = ()=>{
        // Gather all the checks to execute all
        worker.gatherAllChecks();

        // Loop all the gathered checks so it work continue
        worker.loop();


        // Compress all the logs immediately
        worker.rotateLogs();


        // Call the compression  loop so logs will be compressed later on
        worker.logRotationLoop();

    }
 
 
 
// export the module.
 module.exports = worker