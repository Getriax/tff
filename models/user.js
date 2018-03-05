const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    rate: [{type: Schema.Types.ObjectId, ref: 'Rate'}]
});

module.exports = mongoose.model('User', userSchema);