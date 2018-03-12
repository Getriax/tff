const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: String,
    employees: [{type: Schema.Types.ObjectId, ref: 'Employee'}],
    asks: [{type: Schema.Types.ObjectId, ref: 'Ask'}]
});


module.exports = mongoose.model('Category', categorySchema);