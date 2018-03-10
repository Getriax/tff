const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let bidSchema = new Schema({
    employee: {type: Schema.Types.ObjectId, ref: 'Employee'},
    bids: {type: Schema.Types.ObjectId, ref: 'Ask'},
    description: String,
    salary: Number,
    is_accepted: Boolean
});

module.exports = mongoose.model('Bid', bidSchema);