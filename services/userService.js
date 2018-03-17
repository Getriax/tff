const mongoose = require('mongoose'),
    User = require('../models/user'),
    logger = require('../config/logger'),
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

    userMessages(req, res) {
        let messages = res.locals.messages;

        let idToNamesPromise = new Promise((resolve, reject) => {
            for(let element of messages) {
                User.findById(element._id, (err, data) => {
                   if(err) {
                       logger.error(err);
                       reject(err);
                   }
                   if(!data) {
                       reject('User not found');
                   }

                   element.username = data.username;
                   element.first_name = data.first_name;
                   element.last_name = data.last_name;
                   element.send_date = new Date(element.send_date).toLocaleString('en-US', {hour12: false});



                   if(element._id.equals(messages[messages.length - 1]._id)){
                       resolve();
                   }

                });
            }
        });

        idToNamesPromise.then(() => {
            res.status(200).json(messages);
        })
            .catch((err) => res.status(200).json({message: `${err}`}));
    }
}

function getUserData(userId, req, res) {
    User.findById(userId)
        .select('-_id -__v -password')
        .exec((err, data) => {
            if(err){
                logger.error(err);
                return res.status(404).send({message: 'User does not exist'});
            }

            if(data.status == 0) {
                employeeService.populateOne(userId).then((empdData) => {
                    let payload = {
                        user: data,
                        employee: empdData,
                        rate: res.locals.rate
                    };
                    res.status(200).json(payload);
                }).catch((err) => {res.status(409).json({message: err})});
            }
            else if(data.status == 1){
                employerService.populateOne(userId).then((empdData) => {
                    let payload = {
                        user: data,
                        employer: empdData,
                        rate: res.locals.rate
                    };
                    res.status(200).json(payload);
                }).catch((err) => {res.status(409).json({message: err})});
            }
            else {
                data._doc.rate = res.locals.rate;
                res.status(200).json(data);
            }

        });
}
module.exports = new UserService();