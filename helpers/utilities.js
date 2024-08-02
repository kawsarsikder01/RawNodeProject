const crypto = require('crypto');

const environment= require('./environment');
const file = require('./../lib/data')


const utilites = {};

utilites.parseJson = (jsonString)=>{
    let output;
    try{
        output = JSON.parse(jsonString);
    }catch{
        output = {}
    }

    return output;
}

utilites.hashed = (string)=>{
    if(typeof(string) === 'string' && string.length > 0){
        let hash = crypto.createHmac('sha256',environment.secretKey)
        .update(string)
        .digest('hex');

        return hash;
    }
    return false;
}

utilites.validate = (reqBody , reqFieldRule , message = null)=>{
    let errors = {}; // Initialize an empty object to collect errors

    for (let field in reqFieldRule) {
        let rules = reqFieldRule[field];
        errors[field] = []; // Initialize an array for errors related to this field
    
        for (let rule of rules) {
            switch (rule) {
                case 'required':
                    if (!reqBody[field]) {
                        errors[field].push(`${field} is required.`);
                    }
                    break;
                case 'email':
                    if (reqBody[field] && !/^\S+@\S+\.\S+$/.test(reqBody[field])) {
                        errors[field].push(`${field} must be a valid email.`);
                    }
                    break;
                
                case 'number':
                if (reqBody[field] && isNaN(reqBody[field])) {
                    errors[field].push(`${field} must be a number.`);
                }
                break;
                // Add more cases for other rules
                default:
                    errors[field].push(`Unknown rule: ${rule}`);
                    break;
            }
        }
    
        // Remove the field from errors if no errors were found
        if (errors[field].length === 0) {
            delete errors[field];
        }
    }
    
    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
       errors.status =  true
    } else {
        errors.status =  false
    }
    
return errors

}

utilites.checkUniqueData = (datas , field , value)=>{
    for(let data in datas){
        if(datas[data][field] === value){
            return true;
        }else{
            return false;
        }
    }
}

utilites.findOrFail = (datas  , value)=>{
    console.log(datas);
    for(let data in datas){
        console.log(datas[data])
        if(Number(datas[data].id) === Number(value)){
            return datas[data];
        }
    }

    return false;
}

utilites.findData = (datas , field , value)=>{
    for(let data in datas){
        if(datas[data][field] === value){
            return datas[data];
        }else{
            return false
        }
    }
}

utilites.authenticate = (users, username , password)=>{
    let hashedPassword = utilites.hashed(password);
    let user = utilites.findData(users,'username',username);
    if(user){
        if(user.password === hashedPassword){
            return user;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

utilites.createToken = (length = 20) => {
    let possibleCharacters = 'ABCDEFGHIJKMNLOPQRSTUVWXYZabcdefghijkmnlopqrstuvwxyz0123456789';
    if (typeof length === 'number' && length > 0) {
        let output = '';
        for (let i = 0; i < length; i++) {
            output += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        }
        return output;
    } else {
        let output = '';
        for (let i = 0; i < 20; i++) {
            output += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        }
        return output;
    }
}

utilites.checkToken = async (userToken)=>{

    try{
        let tokens = await file.read('token','tokens');
        
        for (let key in tokens) {
            if (tokens[key] === userToken) {
                return true;
            }
        }
        return false;
        
    }catch(err){
        return false;
    }
}
 

module.exports = utilites;