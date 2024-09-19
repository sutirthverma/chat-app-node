const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    users: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ],
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    }
}, { timestamp: true });



const Message = mongoose.model('message', messageSchema);

module.exports = Message;