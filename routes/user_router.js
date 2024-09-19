const User = require('../models/user_model'); 
const express = require('express');
const Router = express.Router();
const {
    handleGetSignUpPage,
    handleSignUp,
    handleGetSignInPage,
    handleSignIn,
    handleGetSearchPage,
    handleGetSearchUser,
    handleGetUserInfo,
    handleAddFriend,
    handleRemoveRequest,
    handleDeleteAccount,
    handleUserSignOut,
    handleAcceptFriendRequest,
    handleRejectRequest,
    handleRemoveFriend
} = require('../controllers/user_controller');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, '/photos')
    },
    filename: function (req, file, cb){
        cb(null, `${Date.now()}-${file.filename}`);
    }
})

const upload = multer({storage});

Router.route('/signup')
.get(handleGetSignUpPage)
.post(upload.single('profileImage'), handleSignUp)

Router.route('/signin')
.get(handleGetSignInPage)
.post(handleSignIn)

Router.route('/signout/:id')
.get(handleUserSignOut)

Router.route('/search')
.get(handleGetSearchPage)
.post(handleGetSearchUser)

Router.route('/info/:id')
.get(handleGetUserInfo)

Router.route('/add-friend/:id')
.post(handleAddFriend)

Router.route('/remove-request/:id')
.post(handleRemoveRequest)

Router.route('/remove-account/:id')
.delete(handleDeleteAccount)

Router.route('/accept-request/:id')
.post(handleAcceptFriendRequest)

Router.route('/reject-request/:id')
.post(handleRejectRequest)

Router.route('/remove-friend/:id')
.post(handleRemoveFriend)

module.exports = Router;