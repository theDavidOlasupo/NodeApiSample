//library for storing and editting data

var fs = require('fs');
var path = require('path');


//container for the module to be exported



var lib ={};

lib.baseDir = path.join(__dirname, '/../.data/')
//write data to a file
lib.create = function(dir,file, data, callback){


    //open the file for riting

    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err,filedescriptor){

        if(!err && filedescriptor){

            //convert data to string
            var stringData = JSON.stringify(data);
            //write to file and close it

            fs.writeFile(filedescriptor, stringData, function(err){
                if(!err){

                    //no error in writig to file, so we can close the opened file
                    fs.close(filedescriptor, function(err){

                        if(!err){
                            callback(false)
                        }
                        else{
                            callback('error closing file');
                        }
                    });
                }else{
                    callback('error writing to new file');
                }
            });
        }
        else{
            callback('could not create new file, it may already exist');
        }
    });
};


//read file data
lib.read = function(dir,file, callback){

    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8', function(err,data){
    callback(err,data);
    });
};

//update existing file
lib.update = function(dir,file,data,callback){


    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err,filedescriptor)
    {

        if(!err && filedescriptor){


            //convert data to string
            var stringData = JSON.stringify(data);

            //truncate the file content before new write

        
            fs.ftruncate(filedescriptor, function(err){

                if(!err){
                    //file truncated, now write to the file

                    fs.writeFile(filedescriptor, stringData, function(err){
                        if(!err){
        
                            //no error in writig to file, so we can close the opened file
                            fs.close(filedescriptor, function(err){
                                if(!err){
                                    callback(false)
                                }
                                else{
                                    callback('error closing file');
                                }
                            });
                        }else{
                            callback('error writing to existing file');
                        }
                    });
                }
                else{
                    callback('error truncating file: ',err);
                }
            });
            //file updated
        }else{
            callback('could not open the file for updating, it may not exist yet');
        }
    });
};

lib.delete = function(dir, file, callback){

    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
        if(!err){
callback(false);
        }
        else{

            callback('there was an error deleting the file: ',err);
        }
    });
};



module.exports = lib;


