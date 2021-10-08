
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
  callback(404);
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
                callback(400, {'error': 'user already exists: ',error})
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



// Define the request router
var router = {
  'ping' : handlers.ping,
  'handlers' : handlers.users
};


module.exports = handlers;