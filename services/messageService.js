const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    Message = require('../models/message');

class messageService {

    send(req, res) {
        let userId = req.userID;

        let messageBody = req.body;
        messageBody.from = new mongoose.Types.ObjectId(userId);

        if(messageBody.from.equals(messageBody.to))
            res.status(409).json({success: 'You cannot send message to yourself'});
        else
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
        let pageSize = req.query.pagesize || 10;
        let offset = req.query.page * pageSize || 0;

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

                        res.locals.num = ret.length;

                        //ret = ret.slice()

                        res.locals.messages = ret;
                        next();
                    });
            });
    }

    getAllWithOne(req, res) {
        let userId = new mongoose.Types.ObjectId(req.userID);
        let withId = new mongoose.Types.ObjectId(req.params.id);
        let pageSize = req.query.pagesize || 10;
        let offset = req.query.page * pageSize || 0;

        let countPrimise = new Promise((resolve, reject) => {
            Message.find({$or : [
                {$and: [{from: userId}, {to: withId}]},
                {$and: [{from: withId}, {to: userId}]}
            ]})
                .count()
                .exec((err, data) => {
                    if (err) {
                        logger.error(err);
                        reject({status: 500, msg: 'Failed to load messages'});
                    }
                    if(!data || data === 0)
                        reject({status: 404, msg: 'There is no correspondence between those users'});

                    resolve(data);
                })
        });

        countPrimise.then((num) => {
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
                .skip(offset)
                .limit(pageSize)
                .exec((err, data) => {
                    if (err) {
                        logger.error(err);
                        return res.status(500).json({message: 'Failed to load messages'});
                    }
                    if (!data)
                        res.status(404).json({message: 'There is no correspondence between those users'});


                    data.sort((msg1, msg2) => msg1.send_date - msg2.send_date);

                    let msgs = data.map(msg => {
                        msg._doc.is_sent = msg.from._id.equals(userId);
                        msg._doc.send_date = new Date(msg.send_date).toLocaleString('en-US', {hour12: false});
                        return msg;
                    });

                    let response = {
                        messages: msgs,
                        count: num
                    };

                    res.status(200).json(response);
                });
        }).catch((err) => res.status(err.status).json(err.msg));


    }

}

module.exports = new messageService();