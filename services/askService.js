const mongoose = require('mongoose'),
    Employer = require('../models/employer'),
    Ask = require('../models/');

class AskService {

    create(req, res) {
        let userId = req.userID;
        let askBody = req.body;

        askBody.is_active = true;
        askBody.is_complete = false;


    }

}

module.exports = new AskService();
