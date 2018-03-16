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

        Message.aggregate()
            .match({to: new mongoose.Types.ObjectId(userId)})
            .sort({send_date: 1})
            .group({
                _id: "$from",
                text: {$last: "$content"},
                date: {$last: "$send_date"}
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
                        text: {$last: "$content"},
                        date: {$last: "$send_date"}
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
                                return t._id.equals(element._id) && ((element.date - t.date) < 0)
                            });

                        });

                        res.locals.messages = ret;
                        next();
                    });
            });
        /**
         *
         * message {
         *  with:
         *      {
         *          id: id of user,
         *          username: username of id,
         *      },
         *  texts: [
         *      {
         *          content: 'lala',
         *          send_date: date,
         *          received: true/false (false means I've sent the message, true otherwise)
         *      },
         *      {
         *          content: 'lala',
         *          send_date: date,
         *          received: true/false (false means I've sent the message, true otherwise)
         *      }
         *  ]
         * }
         *
         * {
         *  [
         *  with:
         *      {
         *         id: id of user,
         *         username: username of id,
         *      }
         *  last:
         *      {
         *          content: 'lala',
         *          send_date: date,
         *          received: true/false (false means I've sent the message, true otherwise)
         *      }
         *  ]
         * }
         *
         * @type {Array}
         */

        let messages = [];


    }

}

module.exports = new messageService();