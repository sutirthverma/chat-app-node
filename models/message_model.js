const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    receiver : {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamp: true });



const Message = mongoose.model('message', messageSchema);

module.exports = Message;