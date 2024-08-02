const { validate , parseJson ,checkUniqueData ,hashed , findOrFail}  = require('../helpers/utilities');
const file = require('../lib/data');


class UserController{
    constructor(){

    }

   static async index(requestProperties , callback){

        try{
            let users =  await file.read('users','user');
        return callback(200,users);
        }catch(err){
            return callback(200,{message : 'Users not found'});
        }
       
    }

    static store(requestProperties , callback){
        let validateRule = {
            'firstname' : ['required'],
            'lastname' : ['required'],
            'phone' : ['required' , 'number'],
            'email' : ['required' , 'email'],
            'username' : ['required'],
            'password' : ['required']
        }
        let requestData = requestProperties.body;
        let validated = validate(requestData ,validateRule );
        if(validated.status){
            callback(200 , validated)
        }else{
            file.read('users','user',(err , data)=>{
                if(data){
                    data = parseJson(data);
                    if(checkUniqueData(data,'username',requestData.username)){
                        callback(200 , {error : 'Username already exists'})
                    }else if(checkUniqueData(data,'email' ,requestData.email )){
                        callback(200 , {error : 'Email already exists'})
                    }else{
                    //    
                    
                    let length = Number(Object.keys(data).length);
                    let createData = {
                        'id' : length+1,
                        'firstname' : requestData.firstname,
                        'lastname' :requestData.lastname,
                        'phone' : requestData.phone,
                        'email' : requestData.email ,
                        'username' : requestData.username,
                        'password' : hashed(requestData.password)
                    }
                    data[length+1] = createData;
                        file.update('users','user',data,(err)=>{
                            if(!err){
                                callback(200 , {message : 'User created successfully'})
                            }else{
                                callback(500 , {error : 'Error creating user'})
                            }
                        })
                    }
    
                }else{
                      data = {
                        1 : {
                            'id' : 1,
                            'firstname' : requestData.firstname,
                            'lastname' :requestData.lastname,
                            'phone' : requestData.phone,
                            'email' : requestData.email ,
                            'username' : requestData.username,
                            'password' : hashed(requestData.password)
                        }
                      }
                    file.create('users','user',data,(err)=>{
                        if(!err){
                            callback(200 , {message : 'User created successfully'})
                        }else{
                            file.update('users','user',data,(err)=>{
                                if(!err){
                                    callback(200 , {message : 'User created successfully'})
                                }else{
                                    callback(500 , {error : 'Error creating user'})
                                }
                            });
                        }
                    })
                }
            })
        }
    }

    static show(requestProperties , callback){
        let id = requestProperties.queryStringObject.id
        file.read('users','user',(err,users)=>{
           if(!err){
                let user = findOrFail(parseJson(users),id);
                delete user.password;
            
                if(user){
                    callback(200 , user);
                }else{
                    callback(404,{message : "User is not found"})
                }
           }else{
                callback(500 , {error : 'Error fetching user'})
           }
        })
    }

    static update(request , callback){
        let reqData = request.body;
        let id = request.queryStringObject.id
        let validateRule = {
            'firstname' : ['required'],
            'lastname' : ['required'],
            'phone' : ['required' , 'number'],
            'email' : ['required' , 'email'],
            'username' : ['required'],
            'password' : ['required']
        }

        let validated = validate(reqData ,validateRule );
        if(validated.status){
            callback(200 , validated)
        }else{
            file.read('users','user',(err,users)=>{
                 users = parseJson(users);
                

                if(!err){
                    let user = findOrFail(users,id);
            
                    if(user){
                        user.firstname = reqData.firstname;
                        user.lastname = reqData.lastname;
                        user.phone = reqData.phone;
                        user.email = reqData.email;
                        user.username = reqData.username;
                        users[id] = user;

                        file.update('users','user',users,(err)=>{
                            if(!err){
                                callback(200 , {message:"User Update Sucessfully"});
                            }else{
                                callback(500 , {message : "Error Update User"})
                            }
                        })
                    }else{
                        callback(404,{message : "User is not found"})
                    }
                }else{
                    callback(500 , {error : 'Server side error'})
                }
            })
        }

    }

    static delete(request , callback){
        let id = request.queryStringObject.id
        file.read('users','user',(err,users)=>{
            if(!err){
                users = parseJson(users);
                let user = findOrFail(users,id);
                if(user){
                    delete users[id] ;
                    file.update('users','user',users,(err)=>{
                        if(!err){
                            callback(200 , {message : "User Delete Sucessfully"})
                        }else{
                            callback(500 , {message : "Error Delete User"})
                        }
                    })
                    
                }else{
                    callback(404 , {message : "User is not found"})
                }
            }else{
                callback(500 , {error : 'Server side error'})
            }
        })
    }
}

module.exports = UserController;