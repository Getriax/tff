const authService = require('../../../services/auth'),
    employeeService = require('../../../services/employeeService'),
    userService = require('../../../services/userService'),
    employerService = require('../../../services/employerService');

class Manage {
    constructor(router) {
        router.get('/all',authService.authenticateUser.bind(this), userService.getAll.bind(this));
        router.get('/employees', authService.authenticateUser.bind(this), employeeService.getAll.bind(this));

        router.get('/:id', authService.authenticateUser.bind(this), userService.getOne.bind(this));

        router.post('/change-password', authService.authenticateUser.bind(this), userService.changePassword.bind(this));
        router.post('/rate', authService.authenticateUser.bind(this), userService.rateUser.bind(this));
        router.post('/employee/update/languages', authService.authenticateUser.bind(this), employeeService.updateLanguages.bind(this));
        router.post('/employee/update/software', authService.authenticateUser.bind(this), employeeService.updateSoftware.bind(this));
        router.post('/employee/update/specs', authService.authenticateUser.bind(this), employeeService.updateSpecs.bind(this));
        router.post('/employee/update/certifications', authService.authenticateUser.bind(this), employeeService.updateCertifications.bind(this));
      //  router.post('/employee/update', authService.authenticateUser.bind(this), employeeService.update.bind(this));

    }
}

module.exports = Manage;