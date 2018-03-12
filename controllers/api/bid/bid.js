const authService = require('../../../services/authService'),
    bidService = require('../../../services/bidService'),
    employeeService = require('../../../services/employeeService'),
    askService = require('../../../services/askService');

class Manage {
    constructor(router) {

        router.post('/create/:id', authService.authenticateUser.bind(this), employeeService.addBid.bind(this), askService.addBid.bind(this), bidService.create.bind(this));
       // router.post('/update/:id', authService.authenticateUser.bind(this), skillsService.changeNamesToIds.bind(this), askService.update.bind(this), skillsService.update.bind(this));
       // router.post('/remove/:id', authService.authenticateUser.bind(this), skillsService.changeNamesToIds.bind(this), askService.remove.bind(this), skillsService.update.bind(this));
    }
}

module.exports = Manage;