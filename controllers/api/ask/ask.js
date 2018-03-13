const authService = require('../../../services/authService'),
    skillsService = require('../../../services/skillsService'),
    askService = require('../../../services/askService'),
    bidService = require('../../../services/bidService'),
    employerService = require('../../../services/employerService');

class Manage {
    constructor(router) {
       router.get('/all', authService.authenticateUser.bind(this), askService.getAll.bind(this));
       router.get('/:id', authService.authenticateUser.bind(this), askService.getOne.bind(this));


       router.post('/create', authService.authenticateUser.bind(this), skillsService.changeNamesToIds.bind(this), employerService.createAsk.bind(this),askService.create.bind(this), skillsService.update.bind(this));
       router.post('/update/:id', authService.authenticateUser.bind(this), skillsService.changeNamesToIds.bind(this), askService.update.bind(this), skillsService.update.bind(this));
       router.post('/delete/:id', authService.authenticateUser.bind(this), skillsService.changeNamesToIds.bind(this), askService.remove.bind(this), employerService.deleteAsk.bind(this), bidService.removeBids.bind(this), skillsService.update.bind(this));
    }
}

module.exports = Manage;