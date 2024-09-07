const User = require("../models/user_model");
const { createUserToken } = require("../services/authentication");

async function handleGetSignUpPage(req, res) {
    return res.render('signup')
}

async function handleSignUp(req, res) {
    const { username, email, password } = req.body;

    try {

        await User.create({
            username,
            email,
            password
        });

        return res.render('signin');
    } catch (err) {
        console.log(err.message);
        return res.render('signup');
    }
}

async function handleGetSignInPage(req, res) {
    return res.render('signin');
}

async function handleSignIn(req, res) {
    try {
        const { email, password } = req.body;

        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log(token);
        

        const user = await User.findOne({
            email,
            password
        });

        return res.cookie('token', token).redirect('/');
    } catch (err) {
        return res.render('signin', {
            error: error.message
        })
    }
}

module.exports = {
    handleGetSignUpPage,
    handleSignUp,
    handleGetSignInPage,
    handleSignIn,
}