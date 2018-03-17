const mongoose = require('mongoose'),
    Rate = require('../models/rate'),
    logger = require('../config/logger');

class RateService {
    create(req, res) {
        let userId = req.userID;
        let rateBody = req.body;

        rateBody.user_from = new mongoose.Types.ObjectId(userId);

        if(rateBody.user_from.equals(rateBody.user_to))
            res.status(409).json({message: 'You cannot rate yourself'});
        else {

            Rate.findOne({
                $and: [{user_from: rateBody.user_from, user_to: rateBody.user_to}]
            }, (err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Failed to load rate'});
                }
                //If it's first time rating create new rate
                if(!data) {
                    Rate.create(rateBody, (err) => {
                        if(err) {
                            logger.error(err);
                            return res.status(500).json({message: 'Failed to create rate'});
                        }
                        return res.status(200).json({success: 'Rate created'});
                    });
                }
                //Else just update previous rate
                else {
                    Rate.findByIdAndUpdate(data._id, rateBody, (err) => {
                        if(err) {
                            logger.error(err);
                            return res.status(500).json({message: 'Failed to update rate'});
                        }
                        return res.status(200).json({success: 'Rate updated'});
                    });
                }
            });
        }
    }

    getAverage(req, res, next) {

        let userId = new mongoose.Types.ObjectId(req.params.id) || new mongoose.Types.ObjectId(req.userId);
        console.log(userId);
        Rate.aggregate()
            .match({user_to: userId})
            .group({
                _id: "$user_to",
                avg: {$avg: "$grade"}
            })
            .exec((err, data) => {
                console.log(data);
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Failed to load rate'});
                }
                if(Object.keys(data).length === 0)
                    res.locals.rate = 0;
                else
                    res.locals.rate = data[0].avg;

                next();
            });
    }
}

module.exports = new RateService();