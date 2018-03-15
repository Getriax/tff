const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    User = require('../models/user'),
    Employee = require('../models/employee'),
    Language = require('../models/language'),
    Software = require('../models/software'),
    Spec = require('../models/spec'),
    Certification = require('../models/certification'),
    Category = require('../models/category');

class SkillsService {

    getAllLanguages(req, res) {
        Language.find()
            .select('name level -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
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
                    logger.error(err);
                    return res.status(500).send({message: 'Cannot get specializations'});
                }

                res.json(data);
            });
    }
    getAllSoftware(req, res) {
        Software.find()
            .select('name level -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).send({message: 'Cannot get software'});
                }

                res.json(data);
            });
    }
    getAllCertifications(req, res) {
        Certification.find()
            .select('name -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).send({message: 'Cannot get certifications'});
                }

                res.json(data);
            });
    }
    getAllCategories(req, res) {
        Category.find()
            .select('name -_id')
            .exec((err, data) => {
                if(err) {
                    logger.error(err);
                    return res.status(500).send({message: 'Cannot get categories'});
                }

                res.json(data);
            });
    }

    // update(req, res) {
    //
    //     let propertiesMap = new Map();
    //     let lastProperty;
    //     let updateArray;
    //     let updateID = req.employeeID || req.askID;
    //
    //
    //     if(req.body.categories !== undefined) {
    //         propertiesMap.set('categories', Category);
    //         lastProperty = 'categories';
    //     }
    //     if(req.body.languages !== undefined) {
    //         propertiesMap.set('languages', Language);
    //         lastProperty = 'languages';
    //     }
    //     if(req.body.software !== undefined) {
    //         propertiesMap.set('software', Software);
    //         lastProperty = 'software';
    //     }
    //     if(req.body.specs) {
    //         propertiesMap.set('specs', Spec);
    //         lastProperty = 'specs';
    //     }
    //     if(req.body.certifications) {
    //         propertiesMap.set('certifications', Certification);
    //         lastProperty = 'certifications';
    //     }
    //     if(req.employeeID)
    //         updateArray = 'employees';
    //     else
    //         if(req.askID)
    //             updateArray = 'asks';
    //
    //     if(!lastProperty) {
    //         res.status(200).json({success: 'Updated'});
    //     }
    //     for(let [name, object] of propertiesMap) {
    //
    //
    //         let removePromise = new Promise((resolve, reject) => {
    //             if(req[name] instanceof Array){
    //
    //                 if(req[name].length === 0)
    //                     resolve();
    //
    //                 for(let id of req[name]) {
    //                     object.findById(id, (err, data) => {
    //                         if(err) {
    //                             logger.error(err);
    //                             reject('Internal error');
    //                         }
    //                         if(!data) {
    //                             logger.warn('id of ' + name + ' : ' + id + " does not exist")
    //                         }
    //
    //                         data[updateArray] = data[updateArray].filter(elID => !elID.equals(updateID));
    //
    //                         data.save().then(() => {
    //                             if(id.equals(req[name][req[name].length -1])) {
    //                                 resolve();
    //                             }
    //
    //                         }).catch((err) => {logger.error(err); return res.status(500).json({message: 'Save failed'})});
    //                     });
    //                 }
    //             }
    //             else
    //                 resolve();
    //         });
    //
    //         removePromise.then(() => {
    //             if(req.body[name] instanceof Array) {
    //
    //                 if(req.body[name].length === 0 && lastProperty === name)
    //                         return res.status(200).json({success: 'Updated'});
    //
    //                 for (let id of req.body[name]) {
    //
    //                     object.findById(id, (err, data) => {
    //                         if(err) {
    //                             logger.error(err);
    //                             res.status(500).json({message: 'Internal error'});
    //                         }
    //                         if(!data) {
    //                             logger.warn('id of ' + name + ' : ' + id + " does not exist")
    //                         }
    //                         data[updateArray].push(updateID);
    //                         data.save().then(() => {
    //                             if (id.equals(req.body[name][req.body[name].length - 1]) && lastProperty === name)
    //                                 res.status(200).json({success: 'Updated'});
    //                         }).catch((err) => {logger.error(err); return res.status(500).json({message: 'Save failed'})});
    //                     });
    //                 }
    //             }
    //             else if(lastProperty === name)
    //                 res.status(200).json({success: 'Updated'});
    //         }).catch((err) => res.status(500).json({message: err}));
    //     }
    // }

    changeNamesToIds(req, res, next) {

        let propertiesMap = new Map();
        let lastProperty;
        let nextError = false;

        if(req.body.categories) {
            propertiesMap.set('categories', Category);
            lastProperty = 'categories';
        }
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

                        object.findOne({name: n}, (err, data) => {

                            if(err) {

                                logger.error(err);
                                return reject(err);
                            }
                            if(!data)
                                return reject('We do not support that');
                            ids.push(data._id);
                            if(ids.length === req.body[name].length)
                                resolve(ids);


                        });
                }
            });

            idPromise
                .then((ids) => {
                    req.body[name] = ids;
                    if(name === lastProperty && !nextError)
                        next();

                })
                .catch((err) => {
                    console.log(err);
                    nextError = true;
                    logger.error(err);
                    return res.status(409).json({message: err});
                });
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