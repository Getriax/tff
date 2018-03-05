const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let rateSchema = new Schema({
    grade: {type: Number, min: 1, max: 5},
    description: String,
    user_from: {type: Schema.Types.ObjectId, rel: 'User'},
    user_to: {type: Schema.Types.ObjectId, rel: 'User'}
});

module.exports = mongoose.model('Rate', rateSchema);