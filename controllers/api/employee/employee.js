const authService = require('../../../services/authService'),
    employeeService = require('../../../services/employeeService'),
    skillsService = require('../../../services/skillsService');


class Manage {
    constructor(router) {
        router.get('/all',
            authService.authenticateUser.bind(this),
            employeeService.getAll.bind(this));

        router.post('/update',
            authService.authenticateUser.bind(this),
            skillsService.changeNamesToIds.bind(this),
            employeeService.update.bind(this));
    }
}

module.exports = Manage;