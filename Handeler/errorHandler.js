class ErrorHandler {
    constructor(){

    }

    static notFound(requestProperties,callback){
       return  callback(404, {message: 'Not Found' });
    }

    static methodNotAllowed(requestProperties,callback){
        return callback(405, {message: 'Method Not Allowed' });
    }

    static internalServerError(requestProperties,callback){
        return callback(500, {message: 'Internal Server Error' });
    }

}

module.exports = ErrorHandler;