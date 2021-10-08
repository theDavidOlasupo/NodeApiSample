/** create a server and listen on port 3000 */


var http = require('http');

var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer(function(req, res){


//get the url path
var parsedUrl = url.parse(req.url, true);
var path = parsedUrl.pathname;
var trimmedPath =  path.replace(/^\/+|\/+$/g, '');
//get the http method
var method = req.method;

//get the query params on the request url...this var did not log to console for me, something about the primitve type not being able to be converted
var queryStringParams = parsedUrl.query;
//get the headers
var headers = req.headers;


//get the payload if there is any
var decoder = new StringDecoder('utf-8');
var buffer = '';

//this event comes in whenever data is being streamed to the API..it continues to append it to the end of the buffer...
req.on('data', function(data){

    buffer += decoder.write(data);
});

//,,we check for the end of the data streamusing the 'end' event

req.on('end', function(){ //the end event will always be called but the data event will not always be called

    buffer += decoder.end();
    res.end("sending the response back: ", buffer);

    console.log('request body payload: '+buffer)

    //so we can treat out api event heere..where the data is present
   // res.end('request received at '+ trimmedPath+ " on the method: "+method+ " with this query string params: ");
//console.log("request received with headers: ",headers)
//console.log('received request on: '+ trimmedPath)
//console.log(queryStringParams);

   ///choose the handle to route to..if not found.got to the not found handler

   var chosenHandler = typeof(router[trimmedPath])  !== 'undefined'? router[trimmedPath] : handlers.notfound;
//data obj to send to the handlers
var data = {
       'trimmedPath': trimmedPath,
       'queryStringObject': queryStringParams,
       'method': method,
       'headers': headers,
       'payload': buffer
};

   chosenHandler(data, function(statuscode, payload){

    statuscode =typeof(statuscode) =='number'? statuscode : 200;
    payload = typeof(payload) =='object'? payload : {};


    var payloadString = JSON.stringify(payload);
    console.log('returning this response  on: '+ payloadString);

    res.writeHead(statuscode);
    res.end(payloadString);

   });
});
     
});


server.listen(3000, function(){
  console.log('listening on port 3000');
});

//define the handler
var handlers ={};


//sample hanlder
handlers.sample = function(data, callback){

    callback(406, {'name': 'sample handler'})
};

handlers.notfound = function(data, callback){

    callback(404)
};
//define a router to handle requests
var router = {
    'sample': handlers.sample
};