const User = require('../models/user_model'); 
const express = require('express');
const Router = express.Router();
const {
    handleGetSignUpPage,
    handleSignUp,
    handleGetSignInPage,
    handleSignIn
} = require('../controllers/user_controller');

Router.route('/signup')
.get(handleGetSignUpPage)
.post(handleSignUp)

Router.route('/signin')
.get(handleGetSignInPage)
.post(handleSignIn)

module.exports = Router;