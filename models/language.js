const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let languageSchema = new Schema({
    name: String,
    level: {type: String},
    employees: [{type: Schema.Types.ObjectId, ref: 'Employee'}],
    asks: [{type: Schema.Types.ObjectId, ref: 'Ask'}]
});

module.exports = mongoose.model('Language', languageSchema);