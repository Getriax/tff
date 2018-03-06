const mongoose = require('mongoose'),
    User = require('../models/user'),
    Company = require('../models/company'),
    Employer = require('../models/employer');

class EmployerService {

    create(req, res) {
        let userId = req.userID;
        let userData = req.body;
        let employerID = new mongoose.Types.ObjectId;

        User.findByIdAndUpdate(userId, {status: 1, first_name: userData.first_name, last_name: userData.last_name, phone: userData.phone, city: userData.city}, (err, data) => {
            if(err)
                return res.status(500).send({message: 'Cannot update user'});

            let employer = new Employer({
                user_id: userId
            });

            employer.save((err) => {
                if(err){
                    console.error(err);
                    res.status(500);
                }
                res.status(200).send({success: 'Employer created'});
            });
        });



        //Create companies
        // let promise = new Promise(((resolve, reject) => {
        //     let companies = new Array(userData.company.length);
        //
        //     userData.company.forEach((comp) => {
        //         let newComp = new Company({
        //             _id: new mongoose.Types.ObjectId,
        //             employer: employerID,
        //             name: comp.name,
        //             NIP: comp.NIP,
        //             city: comp.city
        //         });
        //
        //         companies.push(newComp._id);
        //
        //         newComp.save((err) => {
        //             if(err) {
        //                 console.error(err);
        //                 return res.status(500);
        //             }
        //         });
        //     });
        //
        //     resolve(companies);
        // }));

        //Create employer with those companies
        // promise.then((companies) => {
        //     let employer = new Employer({
        //         _id: employerID,
        //         company: companies,
        //         first_name: userData.first_name,
        //         last_name: userData.last_name,
        //         user_id: userId,
        //         git_link: userData.git_link,
        //         linked_in_link: userData.linked_in_link,
        //     });
        //
        //     employer.save((err) => {
        //         if(err){
        //             console.error(err);
        //             res.status(500);
        //         }
        //     })
        // });
    }

}

module.exports = new EmployerService();