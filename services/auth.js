const mongoose = require('mongoose'),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt-nodejs'),
      config = require('../config/config'),
      user = require('../models/user');

class Auth {

    //post /auth/login
    loginUser(req, res) {
        let loginData = req.body;
        console.log(loginData);

        user.findOne({username: loginData.username}, (err, usr) => {
            if(err) {
                console.error(err);
                return res.status(404).json({message: 'User or password invalid'});
            }

            bcrypt.compare(loginData.password, usr.password, (err, answer) => {
                if(err || !answer) {
                    return res.status(404).json({message: 'User or password invalid'});
                }
                let payload = {
                    id: usr._id
                };

                let authToken = jwt.sign(payload, config.tokenPass);


                res.status(200).json({token: authToken});
            });
        });
    }

    registerUser(req, res) {
        let registerData = req.body;
        console.log(registerData);

        let chceckPromise = new Promise((resolve, reject) => {
            user.findOne({username: registerData.username})
                .exec((err, data) => {
                    if(data)
                        reject('User with that name already exists');
                    else
                        user.findOne({email: registerData.email})
                            .exec((err, data) => {
                                if(data)
                                    reject('User with that email already exists');
                                else
                                    resolve();
                            });
                });
        });

        chceckPromise.then((d) => {
            console.log('adding user');
            bcrypt.hash(registerData.password, null, null, (err, hash) => {
                if(err) {
                    console.log(err);
                    return res.json('500');
                }


                let newUser = new user({
                    _id: new mongoose.Types.ObjectId,
                    username: registerData.username,
                    password: hash,
                    email: registerData.email,
                    status: -1
                });

                newUser.save((err) => {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({message: 'Something went wrong'});
                    }


                    let payload = {
                        id: newUser._id,
                    };

                    let authToken = jwt.sign(payload, config.tokenPass);


                    res.status(200).json({token: authToken});
                });
            });
        })
            .catch((data) => {
                console.log('Error with message ' + data);
                res.json({message: data});
            });

    }

    getUserID(req, res) {
        res.status(200).json({user_id: req.userID});
    }

    authenticateUser(req, res, next) {
        if(!req.header('authorization'))
            return res.status(401).json({ message: 'Unauthorized. Missing Auth Header' });

        let token = req.header('authorization').split(' ')[1];

        let payload = jwt.decode(token, config.tokenPass);

        if(!payload)
            return res.status(401).json({ message: 'Unauthorized. Auth Header Invalid' });

        user.findById(payload.id, (err, user) => {
            if(err) {
                res.status(500).json({message: 'Wrong token'});
            } else {
                req.userID = payload.id;

                next();
            }
        });

    }
}

module.exports = new Auth();