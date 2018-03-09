const authService = require('../../../services/auth'),
    userService = require('../../../services/userService');

class Manage {
    constructor(router) {
        router.get('/all',authService.authenticateUser.bind(this), userService.getAll.bind(this));
        router.get('/me',authService.authenticateUser.bind(this), userService.getLogged.bind(this));

        router.get('/:id', authService.authenticateUser.bind(this), userService.getOne.bind(this));

        router.post('/password', authService.authenticateUser.bind(this), userService.changePassword.bind(this));
        router.post('/rate', authService.authenticateUser.bind(this), userService.rateUser.bind(this));

    }
}

module.exports = Manage;