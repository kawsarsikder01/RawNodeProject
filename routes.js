const UserController  = require('./Handeler/userHandeler');
const AuthHandeler = require('./Handeler/AuthHandeler');
const Auth = require('./Middleware/Auth');

const routes = {
    
    'login' : {
        'POST' : AuthHandeler.login
    },
    
    'middleware' : {
        'users' : {
            'GET' : UserController.index,
            'middlewares' : [Auth]
        },

        'user/store' : {
            'POST' : UserController.store,
            'middlewares' : [Auth]
        },
        'user/show' :{
            'GET' : UserController.show,
            'middlewares' : [Auth]
        },
        'user/update' :{
            'PUT' : UserController.update,
            'middlewares' : [Auth]
        },
        'user/delete' :{
            'DELETE' : UserController.delete,
            'middlewares' : [Auth]
        },
    }
}

module.exports = routes;