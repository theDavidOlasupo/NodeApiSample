/**Helpers for various tasks */

//const { builtinModules } = require("module");

//dependencies

var crypto = require('crypto');
//const { config } = require('process');
var config = require('./config')



//create a container for the lib
var helpers= {};


//sha 256 is built into Node.. so you don't need an expternal library.
helpers.hash = function(str){

    if(typeof(str) =='string' && str.length > 0 ) {
        var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex')
        return hash;
    }
    else{
        return false;
    }
};

//parse a json sttring to an object without throwing
helpers.parseJsonToObject = function(str){

    try {
       var parsedPayload = JSON.parse(str);
       return parsedPayload;
         
    } catch (error) {
        return {};
    }
};




module.exports = helpers;