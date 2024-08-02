const routes = require('./../routes');
const url  = require('url');
const ErrorHandler = require('./../Handeler/errorHandler');


class Request {
    constructor(request, requestProperties) {
        this.request = request;
        this.requestProperties = requestProperties;
    }

    async handleMiddleware(middleware) {
        let request = this.request;
        let Middleware = middleware;
        let middlewareObject = new Middleware(request);

        try {
            let result = await middlewareObject.boot();
            if(result === true){
                return true;
            }else{
              return result
            }
        } catch (error) {
            return {
                status: 500,
                message: 'Internal Server Error',
            };
        }
    }

    async handleRequest() {
        let request = this.request;
        const parsedUrl = url.parse(request.url, true);
        const path = parsedUrl.pathname;
        const trimPath = path.replace(/^\/+|\/+$/g, '');
        const method = request.method.toUpperCase();
        const queryStringObject = parsedUrl.query;
        const headerObject = request.headers;
        const requestProperties = this.requestProperties;

        if (!this.allowedMethod(method)) {
            let handleMethodError = await ErrorHandler.methodNotAllowed(requestProperties, (status, payload) => {
                if (status) {
                    return {
                        status: status,
                        payload: payload ?? {}
                    };
                } else {
                    return {
                        status: 500,
                        payload: { message: 'Internal Server Error' }
                    };
                }
            });
            return handleMethodError;
        }

        if (routes[trimPath]) {
            if (routes[trimPath][method]) {
                let chosenHandler = routes[trimPath][method];
                let result = await new Promise((resolve) => {
                    chosenHandler(requestProperties, (status, payload) => {
                        if (status) {
                            resolve({
                                status: status,
                                payload: payload ?? {}
                            });
                        } else {
                            resolve({
                                status: 500,
                                payload: { message: 'Internal Server Error' }
                            });
                        }
                    });
                });
                return result;
            } else {
                let methodNotAllowed = await ErrorHandler.methodNotAllowed(requestProperties, (status, payload) => {
                    if (status) {
                        return {
                            status: status,
                            payload: payload ?? {}
                        };
                    } else {
                        return {
                            status: 500,
                            payload: { message: 'Internal Server Error' }
                        };
                    }
                });
                return methodNotAllowed;
            }
        } else if (routes.middleware && routes.middleware[trimPath]) {
            let routeMiddlewares = routes.middleware[trimPath].middlewares;
            for (let middleware of routeMiddlewares) {
                let handleMiddleWare = await this.handleMiddleware(middleware);
                
                if(typeof handleMiddleWare === 'object'){
                  return handleMiddleWare;
                }
            }

            let chosenHandler = routes.middleware[trimPath][method];
            if(chosenHandler){
              let result = await new Promise((resolve) => {
                chosenHandler(requestProperties, (status, payload) => {
                    if (status) {
                        resolve({
                            status: status,
                            payload: payload ?? {}
                        });
                    } else {
                        resolve({
                            status: 500,
                            payload: { message: 'Internal Server Error' }
                        });
                    }
                });
            });
            return result;
            }else{
              let handleError = await ErrorHandler.methodNotAllowed(requestProperties, (status, payload) => {
                if (status) {
                    return {
                        status: status,
                        payload: payload ?? {}
                    };
                } else {
                    return {
                        status: 500,
                        payload: { message: 'Internal Server Error' }
                    };
                }
            });
            return handleError;
            }

        } else {
            let handleError = await ErrorHandler.notFound(requestProperties, (status, payload) => {
                if (status) {
                    return {
                        status: status,
                        payload: payload ?? {}
                    };
                } else {
                    return {
                        status: 500,
                        payload: { message: 'Internal Server Error' }
                    };
                }
            });
            return handleError;
        }
    }

    allowedMethod(method) {
        const acceptedMethod = ['GET', 'POST', 'PUT', 'DELETE'];
        return acceptedMethod.includes(method);
    }
}

module.exports = Request;


module.exports = Request;