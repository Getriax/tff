const mongoose = require('mongoose'),
    logger = require('../config/logger'),
    User = require('../models/user'),
    Employee = require('../models/employee'),
    skillsService = require('./skillsService');

class EmployeeService {

    create(req, res) {
        let userId = req.userID;
        let userData = req.body;
        User.findByIdAndUpdate(userId, {status: 0, first_name: userData.first_name, last_name: userData.last_name, phone: userData.phone, city: userData.city}, (err, data) => {
            if(err)
                return res.status(500).send({message: 'Cannot update user'});

            let employee = new Employee({
                user_id: userId,
            });

            employee.save((err) => {
                if(err){
                    logger.error(err);
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
                .populate('categories', 'name -_id')
                .exec((err, data) => {
                    if(!data)
                        reject('Employer not found')
                    if(err)
                        reject('Internal error');
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



    update(req, res, next) {
        let userId = req.userID;
        let updateBody = req.body;

        Employee.findOneAndUpdate({user_id: userId}, updateBody)
            .exec((err, data) => {
                if(!data)
                    return res.status(404).json({message: 'Employee not found'});
                if(err)
                    return res.status(500).json({message: 'Cannot update employee'});

                req.categories = data.categories;
                req.languages = data.languages;
                req.software = data.software;
                req.specs = data.specs;
                req.certifications = data.certifications;
                req.employeeID = data._id;
                next();
            });
    }

}



module.exports = new EmployeeService();