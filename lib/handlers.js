
const exp = require('constants');
//const { json } = require('stream/consumers');
var _data = require('./data')
var helpers = require('./helpers')



// Define all the handlers
var handlers = {};

// Sample handler
handlers.ping = function(data,callback){
    callback(200);
};

// Not found handler
handlers.notFound = function(data,callback){
  callback(404, {'error': 'this method does not exist, chec spelling'});
};



//token handler

// Users
handlers.tokens = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
      handlers._tokens[data.method](data,callback);
    } else {
      callback(405);
    }
  };

  handlers._tokens = {};

//token container


//token methods
//required data is phone and password..optional data is none
handlers._tokens.post = function(data, callback){

    console.log('request came in...about to validate data')
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
   
    if(phone && password){

        console.log('request data validated...about to validate data does not exist already')
        ///check if it exists

        _data.read('users',phone, function(err, userData){

            if(!err && userData){

                //hash the sent password and compare it to the password stored in the user object
                //hash the sent password and compare it to the password stored in the user object
               /// var hashedPassword = "sdsdvfee";//helpers.hash(password);

                console.log('got to the method, about to validate that password is hashed value: hashedpasword is:'+ JSON.stringify(userData))
               console.log('password is: '+password);
                if(password === userData.password){
                    //if valid, create a token for the user with an expiration date one hour into the future
                    
                    console.log('password is equal to hashed password')
                
                    var tokenId = helpers.createRandomString(20);

                    console.log(tokenId);
                    var expires = Date.now() + 1000 * 60 * 60;

                    var tokenObject = {
                        'phone': phone,
                        'id' : tokenId,
                        'expires': expires
                    };

                    _data.create('tokens', tokenId, tokenObject, function(err){

                        if(!err){

                            callback(200, tokenObject);
                        }
                        else{
                            callback(500, {'error' : 'oops we messed up'})
                        }
                    });
                }
                else{
                    console.log('wrong password hash')
                    callback(500, {'error' : 'wrong password hash'})
                }
            }
            else{
                callback(400, {'error' : 'user not found'})
            }
        });
    }
    else{

        callback(400, {'error': 'missing required fields'})
    }
};


handlers._tokens.put = function(data, callback){

};

handlers._tokens.delete = function(data, callback){

};

handlers._tokens.get = function(data, callback){

};


//users handlers

// Users
handlers.users = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
      handlers._users[data.method](data,callback);
    } else {
      callback(405);
    }
  };
handlers._users = {};

//user - post
//params: firstname, lastname, phone, todoagreement, password
handlers._users.post = function(data, callback){

    //validate the data meets our requirements
    // var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ?  data.payload.firstName.trim() : false;
    // var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ?  data.payload.lastName.trim() : false;
    // var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?  data.payload.password.trim() : false;
    // var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?  data.payload.phone.trim() : false;
    // var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.phone.tosAgreement == true ?  data.payload.tosAgreement : false;

    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;


    if(firstName && lastName && phone && tosAgreement && password){

        //check for duplicate user phone numbers

        _data.read('users', phone, function(err,data){

            if(err){

                var hashedPassword = "sdsdvfee";//helpers.hash(password);

                if(hashedPassword){
                    //create the user object
                var userObject = {
                    'firstName': firstName,
                    'lastName': lastName,
                    'phone' : phone,
                    'password': hashedPassword,
                    'tosAgreement' : tosAgreement
                };

                // {
                //     "firstName" : "David",
                //     "lastName" : "Ola",
                //     "phone" : "1234567892",
                //     "password" : "testweord",
                //     "tosAgreement" : false
                // }

                //store the user

                _data.create('users', phone,userObject, function(err){
                    if(!err){
                        callback(200);
                    }else{
                        console.log(err);
                        callback(500, {'error' :'could not save user: '+err})
                    }
                });

                } else{
                    callback(500, 'could not hash the password');
                }
            }
            else{
                callback(400, {'error': 'user already exists: '})
            }
        });
    }else{
        callback(400, {'error' : 'Missing required fields'})
    }
};

handlers._users.put = function(data, callback){

};
handlers._users.delete = function(data, callback){

};


 

module.exports = handlers;