const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    Employer = require('../models/employer');

class EmployerService {

    create(req, res, next) {
        let userId = req.userID;

        Employer.create({user_id: userId}, (err) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Creating user failed'});
            }

            res.locals.msg = 'Employer created';

            next();
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

    getId(req, res, next) {
        let userId = req.userID;

        Employer.findOne({user_id: userId}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }

            if(data)
            req.employerID = data._id;

            next();
        });
    }

    addCompany(req, res, next) {
        let userId = req.userID;
        let companyId = new mongoose.Types.ObjectId;

        Employer.findOne({user_id: userId}, (err, data) => {
            if(err) {
                console.error(err);
                return res.status(404).json({message: 'User not found'});
            }

            req.body._id = companyId;
            req.body.employer = data._id;

            data.company.push(companyId);

            data.save((err) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Internal error'});
                }
                next();
            });
        });
    }

    removeCompany(req, res, next) {
        let userId = req.userID;
        let companyId = req.params.id;


        Employer.findOne({user_id: userId}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Something went wrong'});
            }
            if(!data)
                return res.status(500).json({message: 'Employer with that company not found'});


                if(data.company instanceof Array) {
                    data.company = data.company.filter(element => !element._id.equals(companyId) );
                }
                else {
                    data.company = [];
                }
                data.save((err) => {
                    if(err) {
                        logger.error(err);
                        return res.status(500).json({message: 'Fail while saving employer'});
                    }
                    next();
                });
            });
    }
}

module.exports = new EmployerService();