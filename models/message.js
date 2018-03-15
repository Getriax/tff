const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let messageSchema = new Schema({
    content: {type: String, required: true},
    from: {type: Schema.Types.ObjectId, rel: 'User', required: true},
    to: {type: Schema.Types.ObjectId, rel: 'User', required: true},
    send_date: {type: Date, default: Date.now()},
    is_read: {type: Boolean, default: false}
});

module.exports = mongoose.model('Message', messageSchema);