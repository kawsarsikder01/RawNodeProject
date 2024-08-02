const { authenticate, parseJson, createToken, validate } = require('../helpers/utilities');
const file = require('../lib/data');

class  AuthHandeler {


    constructor() {}



    static async login(request , callback){
        const {username , password} = request.body;
        let validateRule = {
            'username' : ['required'],
            'password' : ['required']
        }
     
        
        let validation = validate(request.body,validateRule)
        if(validation.status){
            let jsonObject = callback(200 , validation);
           return jsonObject;
        }else{
            try{
                let users = await file.read('users','user');
                let authUser = authenticate(users,username,password);
                if(authUser){
                    let token = createToken(40);
                    let tokenObject = {
                        username : token
                    }

                  try{
                     await file.create('token','tokens',tokenObject);
                    return  callback(200,{message : 'logged in successfully',token: token})
                  }catch(err){
                    try{
                        let tokens = await file.read('token','tokens');
                    
                        tokens = parseJson(tokens);
                        tokens[username] = token;
                        try{
                            await file.update('token','tokens',tokens);
                            return  callback(200,{message : 'logged in successfully',token: token})
                        }catch(err){
                            return callback(500,{message : 'server side error'})
                        }                          
                    }catch(err){
                        try{
                            let tokenObject = {
                                username : token
                            }
                            await file.update('token','tokens',tokenObject);
                            return  callback(200,{message : 'logged in successfully',token: token})
                        }catch(err){
                            return callback(500 ,{error : 'Server side error'})
                        }
                    }
                  }
                }else{
                    return callback(401,{message : 'invalid username or password'})
                }
            }catch(err){
                return callback(500, {error : 'Error in database'});
            }
           
        }

       
       
    }
}

module.exports = AuthHandeler;
