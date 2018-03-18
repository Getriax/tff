const authService = require('../../../services/authService'),
    bidService = require('../../../services/bidService'),
    employeeService = require('../../../services/employeeService'),
    askService = require('../../../services/askService');

class Manage {
    constructor(router) {

        router.post('/create/:id',
            authService.authenticateUser.bind(this),
            employeeService.addBid.bind(this),
            askService.addBid.bind(this),
            bidService.create.bind(this));

        router.post('/accept',
            authService.authenticateUser.bind(this),
            bidService.accept.bind(this));
    }
}

module.exports = Manage;