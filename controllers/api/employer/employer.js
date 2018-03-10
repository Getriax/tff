const authService = require('../../../services/authService'),
    employerService = require('../../../services/employerService');

class Manage {
    constructor(router) {

        router.post('/create', authService.authenticateUser.bind(this), employerService.create.bind(this));
        router.post('/update', authService.authenticateUser.bind(this), employerService.update.bind(this));
    }
}

module.exports = Manage;