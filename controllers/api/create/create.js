const authService = require('../../../services/auth'),
      employeeService = require('../../../services/employeeService'),
      employerService = require('../../../services/employerService');

class Create {
    constructor(router) {
        router.post('/employee', authService.authenticateUser.bind(this), employeeService.create.bind(this));
        router.post('/employer', authService.authenticateUser.bind(this), employerService.create.bind(this));
    }
}

module.exports = Create;