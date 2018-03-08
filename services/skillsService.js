const mongoose = require('mongoose'),
    User = require('../models/user'),
    Employee = require('../models/employee'),
    Language = require('../models/language'),
    Software = require('../models/software'),
    Spec = require('../models/spec'),
    Certification = require('../models/certification');

class SkillsService {

    getAllLanguages(req, res) {
        Language.find()
            .select('name level -_id')
            .exec((err, data) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send({message: 'Cannot get languages'});
                }

                res.json(data);
            });
    }
    getAllSpecializations(req, res) {
        Spec.find()
            .select('name level -_id')
            .exec((err, data) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send({message: 'Cannot get languages'});
                }

                res.json(data);
            });
    }
    getAllSoftware(req, res) {
        Software.find()
            .select('name level -_id')
            .exec((err, data) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send({message: 'Cannot get languages'});
                }

                res.json(data);
            });
    }
    getAllCertifications(req, res) {
        Certification.find()
            .select('name -_id')
            .exec((err, data) => {
                if(err) {
                    console.error(err);
                    return res.status(500).send({message: 'Cannot get languages'});
                }

                res.json(data);
            });
    }

    languageRemoveAllUserIds(ids, userID) {
        ids.forEach(id => {
            Language.findById(id, (err, body) => {
                body.users = body.users.filter(userId => userId != userID);

                body.save((err) => {if(err) console.error(err)})
            });
        });
    }
    languageAddAllUserIds(ids, userID) {
        ids.forEach(id => {
            Language.findById(id, (err, body) => {
                body.users.push(userID);

                body.save((err) => console.error(err));
            });
        });
    }
    languageToID(names) {
        return new Promise((resolve, reject) => {
            console.log(names);
            let ids = new Array();
            names.forEach(n => Language.findOne({name: n}, (err, data) => {
                if(err)
                    reject('Languages failure')
                ids.push(data._id);
            }));
            resolve(ids);
        });
    }
    softwareRemoveAllUserIds(ids, userID) {
        ids.forEach(id => {
            Software.findById(id, (err, body) => {
                body.users = body.users.filter(userId => userId != userID);

                body.save((err) => {if(err) console.error(err)})
            });
        });
    }
    softwareAddAllUserIds(ids, userID) {
        ids.forEach(id => {
            Software.findById(id, (err, body) => {
                body.users.push(userID);

                body.save((err) => console.error(err));
            });
        });
    }
    softwareToID(names) {
        return new Promise((resolve, reject) => {
            console.log(names);
            let ids = new Array();
            names.forEach(n => Software.findOne({name: n}, (err, data) => {
                if(err)
                    reject('Languages failure')
                ids.push(data._id);
            }));
            resolve(ids);
        });
    }

    specsRemoveAllUserIds(ids, userID) {
        ids.forEach(id => {
            Spec.findById(id, (err, body) => {
                body.users = body.users.filter(userId => userId != userID);

                body.save((err) => {if(err) console.error(err)})
            });
        });
    }
    specsAddAllUserIds(ids, userID) {
        ids.forEach(id => {
            Spec.findById(id, (err, body) => {
                body.users.push(userID);

                body.save((err) => console.error(err));
            });
        });
    }
    specsToID(names) {
        return new Promise((resolve, reject) => {
            console.log(names);
            let ids = new Array();
            names.forEach(n => Spec.findOne({name: n}, (err, data) => {
                if(err)
                    reject('Languages failure')
                ids.push(data._id);
            }));
            resolve(ids);
        });
    }

    certificationsRemoveAllUserIds(ids, userID) {
        ids.forEach(id => {
            Certification.findById(id, (err, body) => {
                body.users = body.users.filter(userId => userId != userID);

                body.save((err) => {if(err) console.error(err)})
            });
        });
    }
    certificationsAddAllUserIds(ids, userID) {
        ids.forEach(id => {
            Certification.findById(id, (err, body) => {
                body.users.push(userID);

                body.save((err) => console.error(err));
            });
        });
    }
    certificationsToID(names) {
        return new Promise((resolve, reject) => {
            console.log(names);
            let ids = new Array();
            names.forEach(n => Certification.findOne({name: n}, (err, data) => {
                if(err)
                    reject('Languages failure')
                ids.push(data._id);
            }));
            resolve(ids);
        });
    }

}

module.exports = new SkillsService();