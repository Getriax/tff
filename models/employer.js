const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let employerSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    asks: [{type: Schema.Types.ObjectId, ref: 'Ask'}],
    company: [{type: Schema.Types.ObjectId, ref: 'Company'}],
});

module.exports = mongoose.model('Employer', employerSchema);