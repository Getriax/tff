const authService = require('../../../services/auth'),
    employeeService = require('../../../services/employeeService'),
    userService = require('../../../services/userService'),
    employerService = require('../../../services/employerService');

class Manage {
    constructor(router) {
        router.get('/all', userService.getAll.bind(this));
        router.get('/:id', userService.getOne.bind(this));
        router.post('/change-password', authService.authenticateUser.bind(this), userService.changePassword.bind(this));
        router.post('/rate', authService.authenticateUser.bind(this), userService.rateUser.bind(this));
    }
}

module.exports = Manage;