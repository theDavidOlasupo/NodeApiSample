/*create config variables */

const { type } = require("os");

//container for all the environments

var environments = {};

//staging environment

//stagine env
environments.staging ={

    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
}

//prod env
environments.production ={
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
}

//determine which one to be exported out

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';




//check that the sert environment exists in one if the ones above


var environmentToExport = typeof(environments[currentEnvironment]) == 'object'? environments[currentEnvironment] : environments.staging;


module.exports = environmentToExport;