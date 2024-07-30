const UserController  = require('./routeHandelers/userHandeler')

const routes = {
    'users' : {
        'GET' : UserController.index,
    },
    'user/store' : {
        'POST' : UserController.store
    },
    'user/show' :{
        'GET' : UserController.show
    },
    'user/update' :{
        'PUT' : UserController.update
    },
    'user/delete' :{
        'DELETE' : UserController.delete
    }
}

module.exports = routes;