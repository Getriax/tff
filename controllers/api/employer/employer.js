const authService = require('../../../services/auth'),
    employerService = require('../../../services/employerService');

class Manage {
    constructor(router) {

        router.post('/create', authService.authenticateUser.bind(this), employerService.create.bind(this));
    }
}

module.exports = Manage;