const mongoose = require('mongoose'),
    User = require('../models/user'),
    Employee = require('../models/employee'),
    skillsService = require('./skillsService');

class EmployeeService {

    create(req, res) {
        let userId = req.userID;
        let userData = req.body;
        console.log(userData);
        User.findByIdAndUpdate(userId, {status: 0, first_name: userData.first_name, last_name: userData.last_name, phone: userData.phone, city: userData.city}, (err, data) => {
            if(err)
                return res.status(500).send({message: 'Cannot update user'});

            let employee = new Employee({
                user_id: userId,
            });

            employee.save((err) => {
                if(err){
                    console.log(err);
                    return res.status(500);
                }
                res.status(200).send({success: 'Employee created'})
            });
        });
    }

    getOne(req, res) {
        let id_user = req.params.id;

        User.findById(id_user, (err, usr) => {
            if(err)
                return res.status(404).send({message: 'User not found'});
            let user_data = usr;
            Employee.findOne({user_id: id_user}, (err, empl) => {
                let data = {
                    user: user_data,
                    employee: empl
                }
                res.status(200).json(data);
            });
        });
    };

    populateOne(userId) {
        return new Promise((resolve, reject) => {
            Employee.findOne({user_id: userId})
                .select('-__v -_id -user_id')
                .populate('languages', 'name -_id')
                .populate('software', 'name -_id')
                .populate('specs', 'name -_id')
                .populate('certifications', 'name -_id')
                .exec((err, data) => {
                    if(err)
                        reject(404);
                    resolve(data);
                })
        })
    }


    getAll(req, res) {
        Employee.find()
            .populate('user_id')
            .exec((err, data) => {
                if(err)
                    return res.status(500).send({message: 'Employess not found'});

                res.status(200).json(data);
            });
    };


    updateLanguages(req, res) {
        let userId = req.userID;
        let languagess = req.body.languages;

        if(languagess == null || languagess == undefined) {
            Employee.findOne({user_id: userId}, (err, data) => {
                if(err) {
                    return res.status(500).send({message: 'User null'});
                }
                console.log(data);

                if(data.languages.length > 0) {
                    skillsService.languageRemoveAllUserIds(data.languages, userId);
                }

                data.languages = []
                data.save((err) => {
                    if(err)
                        return res.status(500);
                    return res.status(200).json({success: 'Updated'});
                });
            });
        }
        else {
            if(!(languagess instanceof Array))
                languagess = new Array(languagess);
            console.log(req.body);

            skillsService.languageToID(languagess).then((ids) => {
                Employee.findOne({user_id: userId}, (err, usr) => {
                    console.log(usr);
                    console.log(usr.languages.length > 0);

                    if(usr.languages.length > 0) {
                        skillsService.languageRemoveAllUserIds(usr.languages, userId);
                    }

                    skillsService.languageAddAllUserIds(ids, userId);

                    usr.languages = ids;
                    usr.save((err) => {if(err) console.error(err); else return res.status(200).json({success: 'Updated'});});
                });
            });
        }
    }

    updateSoftware(req, res) {
        let userId = req.userID;
        let softwaree = req.body.software;

        if(softwaree == null || softwaree == undefined) {
            Employee.findOne({user_id: userId}, (err, data) => {
                if(err) {
                    return res.status(500).send({message: 'User null'});
                }
                console.log(data);

                if(data.software.length > 0) {
                    skillsService.softwareRemoveAllUserIds(data.software, userId);
                }

                data.software = []
                data.save((err) => {
                    if(err)
                        return res.status(500);
                    return res.status(200).json({success: 'Updated'});
                });
            });
        }
        else {
            if(!(softwaree instanceof Array))
                softwaree = new Array(softwaree);


            skillsService.softwareToID(softwaree).then((ids) => {
                Employee.findOne({user_id: userId}, (err, usr) => {


                    if(usr.software.length > 0) {
                        skillsService.softwareRemoveAllUserIds(usr.software, userId);
                    }

                    skillsService.softwareAddAllUserIds(ids, userId);

                    usr.software = ids;
                    usr.save((err) => {if(err) console.error(err); else return res.status(200).json({success: 'Updated'});});
                });
            });
        }
    }

    updateSpecs(req, res) {
        let userId = req.userID;
        let specc = req.body.specs;

        if(specc == null || specc == undefined) {
            Employee.findOne({user_id: userId}, (err, data) => {
                if(err) {
                    return res.status(500).send({message: 'User null'});
                }

                if(data.specs.length > 0) {
                    skillsService.specsRemoveAllUserIds(data.specs, userId);
                }

                data.specs = []
                data.save((err) => {
                    if(err)
                        return res.status(500);
                    return res.status(200).json({success: 'Updated'});
                });
            });
        }
        else {
            if(!(specc instanceof Array))
                specc = new Array(specc);
            console.log(req.body);

            skillsService.specsToID(specc).then((ids) => {
                Employee.findOne({user_id: userId}, (err, usr) => {

                    if(usr.specs.length > 0) {
                        skillsService.specsRemoveAllUserIds(usr.specs, userId);
                    }

                    skillsService.specsAddAllUserIds(ids, userId);

                    usr.specs = ids;
                    usr.save((err) => {if(err) console.error(err); else return res.status(200).json({success: 'Updated'});});
                });
            });
        }
    }

    updateCertifications(req, res) {
        let userId = req.userID;
        let crett = req.body.certifications;

        if(crett == null || crett == undefined) {
            Employee.findOne({user_id: userId}, (err, data) => {
                if(err) {
                    return res.status(500).send({message: 'User null'});
                }

                if(data.specs.length > 0) {
                    skillsService.certificationsRemoveAllUserIds(data.certifications, userId);
                }

                data.certifications = []
                data.save((err) => {
                    if(err)
                        return res.status(500);
                    return res.status(200).json({success: 'Updated'});
                });
            });
        }
        else {
            if(!(crett instanceof Array))
                crett = new Array(crett);
            console.log(req.body);

            skillsService.certificationsToID(crett).then((ids) => {
                Employee.findOne({user_id: userId}, (err, usr) => {

                    if(usr.certifications.length > 0) {
                        skillsService.certificationsRemoveAllUserIds(usr.certifications, userId);
                    }

                    skillsService.certificationsAddAllUserIds(ids, userId);

                    usr.certifications = ids;
                    usr.save((err) => {if(err) console.error(err); else return res.status(200).json({success: 'Updated'});});
                });
            });
        }
    }

    update(req, res) {
        let userId = req.userID;
        let updateBody = req.body;

        Employee.findOneAndUpdate({user_id: userId}, updateBody)
            .exec((err, body) => {
                if(!body)
                    return req.status(404).json({message: 'Employee not found'});
                if(err)
                    return req.status(500).json({message: 'Something went wrong'});

                return res.status(200).json({success: 'Updated'});
            });
    }

}



module.exports = new EmployeeService();