const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let askSchema = new Schema({
    employer: {type: Schema.Types.ObjectId, ref: 'Employer'},
    bids: [{type: Schema.Types.ObjectId, ref: 'Bid'}],
    description: String,
    salary: Number,
    work_time: Number,
    is_active: Boolean,
    is_complete: Boolean,
    languages: [{type: Schema.Types.ObjectId, ref: 'Language'}],
    software: [{type: Schema.Types.ObjectId, ref: 'Software'}],
    specs: [{type: Schema.Types.ObjectId, ref: 'Spec'}],
    certifications:  [{type: Schema.Types.ObjectId, ref: 'Certification'}]
});

module.exports = mongoose.model('Ask', askSchema);