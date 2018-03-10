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

    update(req, res) {

        let propertiesMap = new Map();
        let lastProperty;
        let updateArray;
        let updateID = req.employeeID || req.askID;

        if(req.body.languages) {
            propertiesMap.set('languages', Language);
            lastProperty = 'languages';
        }
        if(req.body.software) {
            propertiesMap.set('software', Software);
            lastProperty = 'software';
        }
        if(req.body.specs) {
            propertiesMap.set('specs', Spec);
            lastProperty = 'specs';
        }
        if(req.body.certifications) {
            propertiesMap.set('certifications', Certification);
            lastProperty = 'certifications';
        }
        if(req.employeeID)
            updateArray = 'employees';
        else
            if(req.askID)
                updateArray = 'asks';


        for(let [name, object] of propertiesMap) {



            let removePromise = new Promise((resolve, reject) => {
                for(let id of req[name]) {
                    object.findById(id, (err, data) => {
                        if(err)
                            reject('Update failed');
                        data[updateArray] = data[updateArray].filter(elID => !elID.equals(updateID));
                        data.save().then(() => {
                            if(id.equals(req[name][req[name].length -1])) {
                                resolve();
                            }

                        });
                    });
                }
            });

            removePromise.then(() => {
                for(let id of req.body[name]) {
                    object.findById(id, (err, data) => {
                        data[updateArray].push(updateID);
                        data.save().then(() => {
                            if(id.equals(req.body[name][req.body[name].length - 1]) && lastProperty == name)
                                res.status(200).json({success: 'Updated'});
                        });
                    })
                }
            });
        }
    }

    changeNamesToIds(req, res, next) {

        let propertiesMap = new Map();
        let lastProperty;

        if(req.body.languages) {
            propertiesMap.set('languages', Language);
            lastProperty = 'languages';
        }
        if(req.body.software) {
            propertiesMap.set('software', Software);
            lastProperty = 'software';
        }
        if(req.body.specs) {
            propertiesMap.set('specs', Spec);
            lastProperty = 'specs';
        }
        if(req.body.certifications) {
            propertiesMap.set('certifications', Certification);
            lastProperty = 'certifications';
        }
        if(!lastProperty)
            next();

        for(let [name, object] of propertiesMap) {


            let idPromise = new Promise((resolve, reject) => {
                let ids = new Array();
                for(let n of req.body[name]) {

                        let pushPromise = object.findOne({name: n}).exec();
                        pushPromise.then((data) => {
                            if(!data)
                               return reject('We do not support that');
                            ids.push(data._id);
                            if(ids.length == req.body[name].length)
                                resolve(ids);
                        });
                }
            });

            idPromise
                .then((ids) => {
                    req.body[name] = ids;
                    if(name == lastProperty)
                        next();

                })
                .catch((err) => {return res.status(409).json({message: err});});

        }
    }

}
function contains(table, value) {
    for(let tVal of table) {
        if(tVal == value)
            return true;
    }
    return false;
}
module.exports = new SkillsService();