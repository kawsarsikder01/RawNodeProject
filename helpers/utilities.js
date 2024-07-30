const crypto = require('crypto');

const environment= require('./environment');


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

module.exports = utilites;