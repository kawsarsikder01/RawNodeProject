class ErrorHandler {
    constructor(){

    }

    static notFound(requestProperties,callback){
        callback(404, {message: 'Not Found' });
    }
    static methodNotAllowed(requestProperties,callback){
        callback(405, {message: 'Method Not Allowed' });
    }
}

module.exports = ErrorHandler;