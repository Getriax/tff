const mongoose = require('mongoose'),
    User = require('../models/user'),
    bcrypt = require('bcrypt-nodejs'),
    Rate = require('../models/rate'),
    employeeService = require('./employeeService');
    employerService = require('./employerService');


class UserService {

    changePassword(req, res) {
        let userId = req.userID;
        let password = req.body.password;


        let hashPromise = new Promise((resolve, reject) => {
            bcrypt.hash(password, null, null, (err, hash) => {
                if(err)
                    reject({message: 'Password encrypting failed'})
                resolve(hash);
            });
        });
        hashPromise.then((hash) => {
            User.findByIdAndUpdate(userId, {password: hash}, (err, data) => {
                if(err)
                    return res.status(500).send({message: 'Password update failed'});
                res.json({success: 'password updated'});
            });
        });
    }

    rateUser(req, res) {
        let userId = req.userID;
        let rateBody = req.body;

        let rate_new = new Rate({
            _id: new mongoose.Types.ObjectId,
            grade: rateBody.grade,
            description: rateBody.description,
            user_from: userId,
            user_to: rateBody.user_to
        });

        rate.save((err) => {if(err) res.status(500).send({message: 'Rating failed'})});

        User.findByIdAndUpdate(rateBody.user_to, {$push: {rate: rate_new._id}}, (err, data) => {
            if(err)
                return res.status(500).send({message: 'rating user failed'});
            res.status(200).json(data);
        });
    }

    getOne(req, res) {

        let userId = req.params.id;
        getUserData(userId, req, res);

    }

    getAll(req, res) {
        User.find()
            .select('-_id -password -__v')
            .exec((err, body) => {
            if(err)
                return res.status(500).send({message: 'Something went wrong'});

            res.status(200).json(body);
        });
    }
    getLogged(req, res) {
        let userId = req.userID;
        getUserData(userId, req, res)
    }


}

function getUserData(userId, req, res) {
    User.findById(userId)
        .select('-_id -__v -password')
        .exec((err, body) => {
            if(err){
                console.error(err);
                return res.status(404).send({message: 'User does not exist'});
            }

            if(body.status == 0) {
                employeeService.populateOne(userId).then((empdData) => {
                    let payload = {
                        user: body,
                        employee: empdData
                    };
                    res.status(200).json(payload);
                });
            }
            else {
                employerService.populateOne(userId).then((empdData) => {
                    let payload = {
                        user: body,
                        employer: empdData
                    };
                    res.status(200).json(payload);
                });
            }
        });
}
module.exports = new UserService();