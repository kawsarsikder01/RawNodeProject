const { StringDecoder } = require('string_decoder');
const url  = require('url');
const routes = require('./../routes');
const ErrorHandler = require('./../routeHandelers/errorHandler');
const { parseJson } = require('./utilities')

const handler = {};
handler.handleReqRes = (req , res)=>{
    const parsedUrl = url.parse(req.url,true);
    const path = parsedUrl.pathname;
    const trimPath = path.replace(/^\/+|\/+$/g,'');
    const method = req.method.toUpperCase();
    const queryStringObject = parsedUrl.query;
    const headerObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimPath,
        method,
        queryStringObject,
        headerObject
    }
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    let chosenHandler ;
    let error = false;
    if(routes[trimPath]){
        if(routes[trimPath][method]){
            chosenHandler = routes[trimPath][method];
        }else{
            chosenHandler = ErrorHandler.methodNotAllowed
            error = true;
        }
    }else{
        chosenHandler = ErrorHandler.notFound;
        error = true;
    }

    if(!handler.allowedMethod(method)){
        chosenHandler = ErrorHandler.methodNotAllowed
    }
    req.on('data',(buffer)=>{
        realData += decoder.write(buffer);  
    })

    req.on('end',()=>{
        realData += decoder.end();

        requestProperties.body = parseJson(realData);

        chosenHandler(requestProperties , (status , payload)=>{
            let  statusCode = typeof(status) === 'number' ? status : 500;
            let Payload = typeof(payload) === 'object' ? payload : {};
 
            const payloadStirng = JSON.stringify(Payload);

            res.setHeader('Content-Type' , 'application/json');
            res.writeHead(statusCode);
            res.end(payloadStirng);
     });

    })

    
}

handler.allowedMethod = (method)=>{
    const acceptedMethod =  ['GET' , 'POST' , 'PUT' , 'DELETE'];
    if(acceptedMethod.indexOf(method) > -1){

        return true;
    }
    return false;

}
module.exports = handler;