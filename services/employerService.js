const mongoose = require('mongoose'),
    User = require('../models/user'),
    logger = require('../config/logger'),
    Company = require('../models/company'),
    Employer = require('../models/employer');

class EmployerService {

    create(req, res) {
        let userId = req.userID;
        let userData = req.body;
        let employerID = new mongoose.Types.ObjectId;

        User.findByIdAndUpdate(userId, {status: 1, first_name: userData.first_name, last_name: userData.last_name, phone: userData.phone, city: userData.city}, (err, data) => {
            if(err)
                return res.status(500).send({message: 'Cannot update user'});

            let employer = new Employer({
                user_id: userId
            });

            employer.save((err) => {
                if(err){
                    console.error(err);
                    res.status(500);
                }
                res.status(200).send({success: 'Employer created'});
            });
        });

    }

    update(req, res) {
        let userId = req.userID;
        let updateBody = req.body;

        Employer.findOneAndUpdate({user_id: userId}, updateBody)
            .exec((err, body) => {
                if(!body)
                    return req.status(404).json({message: 'Employer not found'});
                if(err)
                    return req.status(500).json({message: 'Cannot update employer'});

                return res.status(200).json({success: 'Employer updated'});
            });
    }

    populateOne(userId)  {
        return new Promise((resolve, reject) => {
            Employer.findOne({user_id: userId})
                .select('-__v -_id -user_id')
                .populate('company')
                .populate('asks')
                .exec((err, data) => {
                    if(err) {
                        logger.error(err);
                        reject('Internal error');
                    }
                    if(!data)
                        reject('Employer not found')
                    resolve(data);
                });
        });
    }

    createAsk(req, res, next) {
        let askId = new mongoose.Types.ObjectId;
        let userId = req.userID;

        Employer.findOne({user_id: userId}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Adding bid failed'});
            }
            if(!data) {
                return res.status(404).json({message: 'Employer not found'});
            }

            data.asks.push(askId);
            req.body.employer = data._id;
            data.save((err) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Adding bid failed'});
                }
                req.body._id = askId;
                next();
            });
        });

    }

    deleteAsk(req, res, next) {
        let userId = req.userID;
        let askID = req.params.id;

        Employer.findOne({user_id: userId}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }
            if(!data)
                return res.status(404).json({message: 'Employer not found'});

            data.asks = data.asks.filter(a => !a.equals(askID));

            data.save((err) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Failed saving ask'});
                }
                next();
            })

        });
    }

}

module.exports = new EmployerService();