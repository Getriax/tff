const authService = require('../../../services/auth');

class Some {
    constructor(router) {
        router.post('/login', authService.loginUser.bind(this));
        router.post('/register', authService.registerUser.bind(this));
    }
}

module.exports = Some;