const authService = require('../../../services/authService'),
    companyService = require('../../../services/companyService');


class Manage {
    constructor(router) {
        //router.get('/all', authService.authenticateUser.bind(this), employeeService.getAll.bind(this));

        router.post('/create', authService.authenticateUser.bind(this), companyService.checkIfCompanyAlreadyExists.bind(this), companyService.create.bind(this));
        router.post('/update', authService.authenticateUser.bind(this), companyService.update.bind(this));
        router.post('/delete', authService.authenticateUser.bind(this), companyService.remove.bind(this));

    }
}

module.exports = Manage;