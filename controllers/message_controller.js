const Message = require('../models/message_model');

async function handleSendMessage(req, res){
    try{
        const { from, to, message } = req.body;
        const data = await Message.create({
            message,
            users: [from, to],
            sender: from
        });

        if(!data)
            throw new Error('error');

        return res.redirect('')
        
    }catch(err){
        console.log(err.message);
        return res.redirect('/');
    }
}

async function handleGetAllMessages(req, res){

}

module.exports = {
    handleSendMessage,
    handleGetAllMessages
}