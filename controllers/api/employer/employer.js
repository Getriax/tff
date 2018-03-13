const authService = require('../../../services/authService'),
    askService = require('../../../services/askService'),
    companyService = require('../../../services/companyService');
    employerService = require('../../../services/employerService');

class Manage {
    constructor(router) {

        router.get('/asks/my',
            authService.authenticateUser.bind(this),
            employerService.getId.bind(this),
            askService.getAllOfEmployer.bind(this));

        router.get('/asks/:id',
            authService.authenticateUser.bind(this),
            askService.getAllOfEmployer.bind(this));

        router.get('/companies/my',
            authService.authenticateUser.bind(this),
            employerService.getId.bind(this),
            companyService.getAllOfEmployer.bind(this));

        router.get('/companies/:id',
            authService.authenticateUser.bind(this),
            employerService.getId.bind(this),
            companyService.getAllOfEmployer.bind(this));

        router.post('/create',
            authService.authenticateUser.bind(this),
            employerService.create.bind(this));

        router.post('/update',
            authService.authenticateUser.bind(this),
            employerService.update.bind(this));
    }
}

module.exports = Manage;