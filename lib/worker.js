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


    // timer to execute the worker process once per minute
    worker.loop = ()=>{
        setInterval(() => {
            worker.gatherAllChecks();             
        }, 1000*60);
    }

    worker.init = ()=>{
        // Gather all the checks to execute all
        worker.gatherAllChecks();

        // Loop all the gathered checks so it work continue
        worker.loop();
    }
 
 
 
// export the module.
 module.exports = worker