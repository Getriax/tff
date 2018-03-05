const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let rateSchema = new Schema({
    name: String,
    description: String,
    user: {type: Schema.Types.ObjectId, rel: 'User'},
});

module.exports = mongoose.model('Rate', rateSchema);