/**Helpers for various tasks */

//const { builtinModules } = require("module");

//dependencies

var crypto = require('crypto');
//const { config } = require('process');
var config = require('./config');
const handlers = require('./handlers');



//create a container for the lib
var helpers= {};


//sha 256 is built into Node.. so you don't need an expternal library.
helpers.hash = function(str){

    console.log('about to create random string')
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

//create random string
helpers.createRandomString = function(strLength){


    strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;

    if(strLength){

        console.log('about to create token')
        //define all the possible characters that could go into a string
        var possibleChars = 'qwertyuiopasdfghjklzxcvbnm1234567890'

        var str= '';
        for(i=1; i <= strLength; i++){
            //get random chars from the possible character and append it to the final string
            
            var randomCharacter = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

            str += randomCharacter;
            console.log(Math.random());
        }
        return str;
    }
    else{
        console.log('could not create token')
        return false;
    }

}


module.exports = helpers;