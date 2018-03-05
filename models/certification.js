const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let certificationSchema = new Schema({
    name: String,
    users: [{type: Schema.Types.ObjectId, ref: 'Employee'}],
    asks: [{type: Schema.Types.ObjectId, ref: 'Ask'}]
});

module.exports = mongoose.model('Certification', certificationSchema);