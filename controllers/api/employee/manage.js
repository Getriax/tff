const authService = require('../../../services/auth'),
    employeeService = require('../../../services/employeeService');


class Manage {
    constructor(router) {
        router.get('/all', authService.authenticateUser.bind(this), employeeService.getAll.bind(this));

        router.post('/create', authService.authenticateUser.bind(this), employeeService.create.bind(this));
        router.post('/update/languages', authService.authenticateUser.bind(this), employeeService.updateLanguages.bind(this));
        router.post('/update/software', authService.authenticateUser.bind(this), employeeService.updateSoftware.bind(this));
        router.post('/update/specs', authService.authenticateUser.bind(this), employeeService.updateSpecs.bind(this));
        router.post('/update/certifications', authService.authenticateUser.bind(this), employeeService.updateCertifications.bind(this));

    }
}

module.exports = Manage;