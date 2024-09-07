require('dotenv').config();
const JWT = require('jsonwebtoken');


function createUserToken(user){
    const playload = {
        id: user.id,
        username: user.username,
        email: user.email
    };

    return JWT.sign(playload, process.env.SECRET_KEY);
}

function validateToken(token){
    if(!token) return null;

    return JWT.verify(token, process.env.SECRET_KEY);
}

module.exports = {
    createUserToken,
    validateToken
}