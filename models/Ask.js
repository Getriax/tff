const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let askSchema = new Schema({
    employer: {type: Schema.Types.ObjectId, ref: 'Employer'},
    bids: [{type: Schema.Types.ObjectId, ref: 'Bid'}],
    description: String,
    salary: Number,
    work_time: Number,
    is_active: Boolean,
    is_complete: Boolean
});

module.exports = mongoose.model('Ask', askSchema);