const mongoose = require('mongoose'),
    User = require('../models/user'),
    bcrypt = require('bcrypt-nodejs'),
    Rate = require('../models/rate'),
    employeeService = require('./employeeService');


class UserService {

    changePassword(req, res) {
        let userId = req.userID;
        let password = req.body.password;

        hashPromise = new Promise((resolve, reject) => {
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
                res.json(data);
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

        User.findById(userId, (err, body) => {
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
        });
    }
    getAll(req, res) {
        User.find((err, body) => {
            if(err)
                return res.status(500).send({message: 'Something went wrong'});

            res.status(200).json(body);
        })
    }
}

module.exports = new UserService();