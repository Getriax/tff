const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    Message = require('../models/message');

class messageService {

    send(req, res) {
        let userId = req.userID;

        let messageBody = req.body;
        messageBody.from = userId;

        Message.create(messageBody, (err) => {
            if(err) {
                logger.error(err);
                return res.status(500).json({message: 'Failed to send message'});
            }
            res.status(200).json({success: 'Message sent'})
        });
    }

    getAll(req, res, next) {
        let userId = req.userID;
       // let userId = '5aabafb3f1ba5fabcaa530ce';

        Message.aggregate()
            .match({to: new mongoose.Types.ObjectId(userId)})
            .sort({send_date: 1})
            .group({
                _id: "$from",
                content: {$last: "$content"},
                send_date: {$last: "$send_date"},
                is_read: {$last: "$is_read"}
            })
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Failed to send message'});
                }
                Message.aggregate()
                    .match({from: new mongoose.Types.ObjectId(userId)})
                    .sort({send_date: 1})
                    .group({
                        _id: "$to",
                        content: {$last: "$content"},
                        send_date: {$last: "$send_date"},
                        is_read: {$last: "$is_read"}
                    })
                    .exec((err2, data2) => {
                        if(err2) {
                            logger.error(err);
                            return res.status(500).json({message: 'Failed to load messages'});
                        }

                        let ret;

                        if(data && data2)
                        ret = data2.concat(data);
                        else if(data)
                            ret = data;
                        else if(data2)
                            ret = data2;
                        else
                            res.status(404).json({message: 'User does not have messages'});

                        ret = ret.filter((element, index, self) => {

                            return -1 === self.findIndex((t) => {
                                return t._id.equals(element._id) && ((element.send_date - t.send_date) < 0)
                            });

                        });


                        res.locals.messages = ret;
                        next();
                    });
            });
    }

    getAllWithOne(req, res) {
        let userId = new mongoose.Types.ObjectId(req.userID);
        let withId = new mongoose.Types.ObjectId(req.params.id);
        let page = req.query.page || 0;
        let offset = req.query.pagesize * page || 0;

        Message.find({
            $or : [
                {$and: [{from: userId}, {to: withId}]},
                {$and: [{from: withId}, {to: userId}]}
            ]
        })
            .sort([['send_date', -1]])
            .populate('from', 'username first_name last_name')
            .populate('to', 'username first_name last_name')
            .select('-__v -_id')
            .limit(2)
            .exec((err, data) => {
                if (err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Failed to load messages'});
                }
                if (!data)
                    res.status(404).json({message: 'There is no correspondence between those users'});


                let messages = data.map(msg => {
                    msg._doc.is_sent = msg.from._id.equals(userId);
                    return msg;
                });

                messages.sort((msg1, msg2) => msg1.send_date - msg2.send_date);

                res.status(200).json(messages);
            });
    }

}

module.exports = new messageService();