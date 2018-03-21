const mongoose = require('mongoose'),
    path = require('path'),
    User = require('../models/user'),
    logger = require('../config/logger'),
    bcrypt = require('bcrypt-nodejs'),
    Rate = require('../models/rate'),
    Busboy = require('busboy'),
    fs = require('fs'),
    uploadPath = require('../config/config').imagePath,
    limit = require('../config/config').imageLimit;


class UserService {


    update(req, res) {
        let userId = req.userID;
        let updateBody = req.body;


        let hashPromise = new Promise((resolve, reject) => {

            if(updateBody.password) {
                bcrypt.hash(password, null, null, (err, hash) => {
                    if(err) {
                        reject({message: 'Password encrypting failed'})
                    }
                    resolve(hash);
                });
            }
            else
                resolve(false);
        });
        hashPromise
            .then((hash) => {

            if(hash)
                updateBody.password = hash;

            User.findByIdAndUpdate(userId, updateBody, (err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).json({message: 'Adding bid failed'});
                }
                if(!data)
                    return res.status(404).json({message: 'User not found'});

                return res.status(200).json({success: res.locals.msg ||'User updated'});
            })

        })
            .catch((err) => {return res.status(500).json({message: err})});

    }

    getOne(req, res, next) {

        let userId = req.params.id || req.userID;

        User.findById(userId)
            .select('-__v -password -rate')
            .exec((err, data) => {
                if(err){
                    logger.error(err);
                    return res.status(500).send({message: 'Error while looking for user'});
                }

                if(data.status === 0) {
                    res.locals.employee = true;
                }
                else if(data.status === 1) {
                    res.locals.employer = true;
                }
                else {
                    data._doc.rate = res.locals.rate;
                    return res.status(200).json(data);
                }

                res.locals.userData = data;
                next();
            });
    }

    getAll(req, res) {
        User.find()
            .select('-_id -password -__v')
            .exec((err, body) => {
            if(err)
                return res.status(500).send({message: 'Something went wrong'});

            res.status(200).json(body);
        });
    }


    userMessages(req, res) {
        let messages = res.locals.messages;

        let idToNamesPromise = new Promise((resolve, reject) => {
            for(let element of messages) {
                User.findById(element._id, (err, data) => {
                   if(err) {
                       logger.error(err);
                       reject(err);
                   }
                   if(!data) {
                       reject('User not found');
                   }

                   element.username = data.username;
                   element.first_name = data.first_name;
                   element.last_name = data.last_name;



                   if(element._id.equals(messages[messages.length - 1]._id)){
                       resolve();
                   }

                });
            }
        });

        idToNamesPromise.then(() => {
            res.status(200).json({
                messages: messages,
                count: res.locals.num
            });
        })
            .catch((err) => res.status(200).json({message: `${err}`}));
    }

    imageUpload(req, res, next) {
        let userId = req.userID;

        //If user has already an image remove it
        removeImage(userId)
            .then(() => {
            let is_limit = false;

            let busboy = new Busboy({ headers: req.headers, limits: {fileSize: limit}});
            busboy.on('file', (fieldname, file, filename) => {

                file.fileRead = [];
                let size = 0;

                let extension = filename.split('.')[filename.split('.').length - 1];

                if(['jpg', 'png'].indexOf(extension) === -1)
                    return res.status(409).json({message: 'Wrong image extension, we support only jpg & png files'});

                file.on('data', function(data) {
                    size += data.length;
                    file.fileRead.push(data);
                });

                file.on('end', function() {
                    if(is_limit)
                        return res.status(409).json({message: 'File is to big'});
                    else {
                        if(!fs.existsSync(uploadPath)) {
                            createUploadDirectory(uploadPath);
                        }

                        let data = Buffer.concat(file.fileRead, size);
                        fs.writeFile(uploadPath + '/' + userId + "." + extension, data, null, (err) => {
                            if(err) {
                                logger.error(err);
                                return res.status(500).json({message: 'Error while saving file'});
                            }
                            req.body.image = userId + "." + extension;
                            res.locals.msg = 'Image updated';
                            next();
                        });
                    }
                });
                file.on('limit', () => {
                    is_limit = true;
                })
            });

            req.pipe(busboy);
        })
            .catch((err) => {return res.status(err.status).json({message: err.msg})});
    }

    imageRemove(req, res, next) {
        let userId = req.userID;

        removeImage(userId)
            .then(() => {
                req.body.image = undefined;
                res.locals.msg = 'Image removed';
                next();
            })
            .catch((err) => {
                return res.status(err.status).json({message: err.msg});
            })
    }

}

function createUploadDirectory(path) {
    let previousDir = '';
    for(let dir of path.split('/')) {
        let directory =  previousDir + '/' + dir;
        if(!fs.existsSync(directory)) {
            fs.mkdirSync(directory)
        }

        if(dir !== '')
            previousDir = directory;

    }
}
function removeImage(userId) {
    return new Promise((resolve, reject) => {
        User.findById(userId)
            .select('image -_id')
            .exec((err, data) => {
                if(err){
                    logger.error(err);
                    return reject({status: 500, msg: 'Error while looking for user'});
                }

                if(!data.image)
                    return resolve();
                else {

                        fs.unlink(uploadPath + '/' + data.image, (err) => {
                            if(err) {
                                logger.error('Removing image ' + data.image + 'failed');
                                return reject({status: 500, msg: 'Removing previous image failed'});
                            }
                        });
                    return resolve();
                }
            });
    });
}
module.exports = new UserService();