const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    Ask = require('../models/ask');

class AskService {

    create(req, res, next) {
        let userId = req.userID;
        let askBody = req.body;

        Ask.create(askBody, (err) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Failed creating ask'});
            }
            req.askID = req.body._id;
            next();
        })

        // Employer.findOne({user_id: userId}, (err, data) => {
        //     if(!data)
        //         return res.status(404).json({message: 'Employer not found'});
        //
        //
        //     let ask = new Ask({
        //         _id: new mongoose.Types.ObjectId,
        //         employer: data._id,
        //         description: askBody.description,
        //         salary: askBody.salary,
        //         work_time: askBody.work_time,
        //         is_active: true,
        //         is_complete: false,
        //         languages: askBody.languages,
        //         software: askBody.software,
        //         specs: askBody.specs,
        //         certifications:  askBody.certifications
        //     });
        //     req.askID = ask._id;
        //     data.asks.push(ask._id);
        //
        //     data.save()
        //         .then(() => ask.save()
        //             .catch(() => res.status(500).json({message: 'Saveing error'}))
        //             .then(() => {
        //                 next();
        //             }))
        //         .catch(() => res.status(500).json({message: 'Saveing error'}));
        // });

    }

    update(req, res, next) {
        let updateBody = req.body;
        let askID = req.params.id;

        Ask.findByIdAndUpdate(askID, updateBody, (err, data) => {
            if(!data)
                return res.status(404).json({message: 'Wrong ask id'});
            if(err)
                return res.status(500).json({message: 'Internal error'});

            req.categories = data.categories;
            req.languages = data.languages;
            req.software = data.software;
            req.specs = data.specs;
            req.certifications = data.certifications;
            req.askID = data._id;
            next();
        });
    }

    remove(req, res, next) {
        let askID = req.params.id;

        Ask.findByIdAndRemove(askID, (err, data) => {
            req.categories = data.categories;
            req.languages = data.languages;
            req.software = data.software;
            req.specs = data.specs;
            req.certifications = data.certifications;
            req.askID = data._id;
            req.body.categories = new Array();
            req.body.languages = new Array();
            req.body.software = new Array();
            req.body.specs = new Array();
            req.body.certifications = new Array();
            next();
            // Employer.findById(data.employer, (err, data) => {
            //     if(err) {
            //         logger.error(err);
            //         return res.status(500).json({message: 'Internal error'});
            //     }
            //     if(!data)
            //         return res.status(404).json({message: 'Employer not found'});
            //     data.asks = data.asks.filter(a => !a.equals(askID));
            //
            //     data.save((err) => {
            //         if(err) {
            //             logger.error(err);
            //             return res.status(500).json({message: 'Failed saving ask'});
            //         }
            //         next();
            //     })
            //
            // });

        });
    }

    //BID IS NOT POPULATED

    getAll(req, res) {
        Ask.find()
            .populate('employer')
            .populate('languages', 'name -_id')
            .populate('software', 'name -_id')
            .populate('specs', 'name -_id')
            .populate('certifications', 'name -_id')
            .populate('categories', 'name -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Internal error'});
                }

                if(!data)
                    return res.status(404).json({message: 'Asks not found'});



                res.status(200).json(data);
            });
    }

    getOne(req, res) {
        let askId = req.params.id;

        Ask.findById(askId)
            .populate('employer')
            .populate('languages', 'name -_id')
            .populate('software', 'name -_id')
            .populate('specs', 'name -_id')
            .populate('certifications', 'name -_id')
            .populate('categories', 'name -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Internal error'});
                }

                if(!data)
                    return res.status(404).json({message: 'Ask not found'});

                res.status(200).json(data);
            });
    }

    addBid(req, res, next) {
        let bidId = req.body._id;
        let askId = req.params.id;

        Ask.findById(askId, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }

            if(!data)
                return res.status(404).json({message: 'Ask not found'});

            req.body.ask = data._id;
            data.bids.push(bidId);

            data.save((err) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Failed saving ask'});
                }
                next();
            });
        })
    }

    getAllOfEmployer(req, res) {
        let employerId = req.employerID || req.params.id;

        Ask.find({employer: employerId})
            .populate('languages', 'name -_id')
            .populate('software', 'name -_id')
            .populate('specs', 'name -_id')
            .populate('certifications', 'name -_id')
            .populate('categories', 'name -_id')
            .exec((err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Internal error'});
            }

            if(!data)
                return res.status(404).json({message: 'This user does not have any asks'});

            res.status(200).json(data);
        });
    }

}

module.exports = new AskService();
