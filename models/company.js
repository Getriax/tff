const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
companySchema = new Schema({
    employer: {type: Schema.Types.ObjectId, ref: 'Employer', unique: true},
    name: String,
    NIP: String,
    city: String
});

module.exports = mongoose.model('Company', companySchema);