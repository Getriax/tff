const mongoose = require('mongoose'),
    Employer = require('../models/employer'),
    Company = require('../models/company');

class CompanyService {
    
    create(req, res) {
        let userId = req.userID;
        let companyBody = req.body;



        Employer.findOne({user_id: userId}, (err, data) => {
            if(err) {
                console.error(err);
                return res.status(404).json({message: 'User not found'});
            }


           let employerId = data._id;

           let company = new Company({
               _id: new mongoose.Types.ObjectId,
               employer: employerId,
               name: companyBody.name,
               NIP: companyBody.NIP,
               city: companyBody.city
           });

           data.company.push(company._id);

           data.save()
               .then(() => {
                   company.save((err) => {
                       if(err) {
                           console.error(err);
                           res.status(500).json({message: 'Company save went wrong'});
                       }

                       res.status(200).json({success: 'Company created'});
                   });
           });

        });
    }

    remove(req, res) {
        let userId = req.userID;
        let companyNIP = req.body.NIP;

        Employer.findOne({user_id: userId})
            .populate('company')
            .exec((err, data) => {
            if(!data)
                return res.status(500).json({message: 'Employer with that company not found'});
            if(err) {
                console.log(err);
                return res.status(500).json({message: 'Something went wrong'});
            }

            console.log(data.company instanceof Array);
            if(data.company instanceof Array) {
                data.company = data.company.filter(element => element.NIP != companyNIP);
            }
            else {
                data.company = '';
            }
            data.save()
                .catch(() => {return res.status(500).json({message: 'Cannot update employer'});})
                .then(() => {
                    Company.findOne({NIP: companyNIP}).remove().exec((err) => {
                        if(err)
                            return res.status(500).json({message: 'Something went wrong'});


                       return res.status(200).json({success: `Company deleted`});
                    });
                });
        });
        

    }

    update(req, res) {
        let companyNIP = req.body.NIP;
        let companyUpdate = req.body;
        console.log(req.body);
        Company.findOneAndUpdate({NIP: companyNIP}, companyUpdate ,(err) => {
            if(err)
                return res.status(500).json({message: 'Something went wrong'});
            return res.status(200).json({success: `Company updated`});
        });
    }

    checkIfCompanyAlreadyExists(req, res, next) {
        let companyNIP = req.body.NIP;
        Company.findOne({NIP: companyNIP}, (err, body) => {
            if(body)
                return res.status(409).json({message: 'Comapny with that NIP already exists'});

            next();
        })
    }
}

module.exports = new CompanyService();