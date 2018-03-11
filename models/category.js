const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: String,
    employees: [{type: Schema.Types.ObjectId, ref: 'Employee'}],
    asks: [{type: Schema.Types.ObjectId, ref: 'Ask'}]
});

function toLower(v) {
    return v.toLowerCase();
}

module.exports = mongoose.model('Category', categorySchema);