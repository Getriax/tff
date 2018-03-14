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

    getAll(req, res) {
        let userId = req.userID;

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