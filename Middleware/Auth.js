const {checkToken} = require('./../helpers/utilities');

class Auth {
    constructor(request){
        this.request = request;
    }

    async boot(){

        const authorizationHeader = this.request.headers['authorization'];
        if(authorizationHeader){
            const token = authorizationHeader.split(' ')[1];
            if(token){
                const isValid = await checkToken(token);
                
                if(isValid){
                   return true;
                }else{
                    return {
                        message : 'Token is Invalid',
                        status : 403
                    };
                }
            }else{
                return {
                    message : 'Your are not authenticated user',
                    status : 401
                };
            }
        }else{
            return {
                message : 'Your are not authenticated user',
                status : 401
            };
        }
    }
}
module.exports = Auth;

