const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

let userSchema = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    rate: [{type: Schema.Types.ObjectId, ref: 'Rate'}],
    status: Number,
    phone: String,
    city: String
});

module.exports = mongoose.model('User', userSchema);