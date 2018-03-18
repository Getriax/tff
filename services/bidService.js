const mongoose = require('mongoose'),
    Employee = require('../models/employee'),
    logger = require('../config/logger'),
    Bid = require('../models/bid');

class BidService {

    create(req, res) {
        let bidBody = req.body;

        Bid.create(bidBody, (err) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Saving error'});
            }
            return res.status(200).json({success: 'Bid created'});
        });
    }

    removeBids(req, res, next) {
        let askId = req.askID;

        Bid.find({ask: askId}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Error while looking for bids'});
            }
            if(!data) {
                next();
            }

            data.forEach(object => {
                object.remove(err => {
                    if(err) {
                        logger.error(err);
                        return res.status(500).json({message: 'Cannot remove bid'});
                    }
                    if(object._id.equals(data[data.length - 1]._id))
                        next();
                });
            });
        });
    }

    accept(req, res) {
        let bidId = req.params.id;

        Bid.findByIdAndUpdate(bidId, {is_accepted: true}, (err, data) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Cannot remove bid'});
            }
            if(!data)
                return res.status(404).json({message: 'Bid with that id not found'});

            return res.status(200).json({success: 'Bid updated'});
        })
    }
}

module.exports = new BidService();