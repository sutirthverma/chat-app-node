const mongoose = require('mongoose');

async function makeConnection(path){
    return mongoose.connect(path);
}

module.exports = {
    makeConnection
}