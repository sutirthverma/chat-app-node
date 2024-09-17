const User = require("../models/user_model");
const { Types } = require('mongoose');

const { createUserToken } = require("../services/authentication");
const { currentUser } = require("../middlewares/auth_middleware");

async function handleGetSignUpPage(req, res) {
    return res.render('signup')
}

async function handleSignUp(req, res) {
    try {
        const profileImage = req.file?.path;
        const { username, email, password } = req.body;
        console.log(profileImage);
        if (profileImage) {
            await User.create({
                profileImage,
                username,
                email,
                password
            });
        } else {
            await User.create({
                username,
                email,
                password
            });
        }

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

        console.log('entered handle sign in');
        
        const { email, password } = req.body;

        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log(token);

        console.log(`token finding token`);



        const user = await User.findOne({
            email
        });

        console.log('finding user');
        

        if (!user) {
            throw new Error('Invalid credentials');
        }

        res.cookie('token', token);

        //Set current user
        currentUser();

        console.log(`cookie set`);

        console.log(`homepage token`);
        
        return res.redirect('/');
    } catch (error) {
        console.log(error.message);

        return res.render('signin', {
            error: error.message
        })
    }
}

async function handleGetSearchUser(req, res) {
    try {
        console.log('entered');
        const userToFind = req.body.searchName;

        if (!userToFind) {
            return res.render('search', {
                message: 'Please enter a valid username'
            })
        }

        const regex = new RegExp(`^${userToFind}`, 'i');
        const usersList = await User.find({ username: regex });
        console.log(usersList);


        if (usersList.length <= 0) {
            return res.render('search', {
                message: 'No user found'
            })
        }

        res.render('search', { usersList });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
}

async function handleGetSearchPage(req, res) {
    return res.render('search');
}


//User Info
async function handleGetUserInfo(req, res) {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });
    const currUserId = req.user.id;
    const currUser = await User.findOne({ _id: currUserId });

    let reqRec = false;
    let reqSent = false;
    let friends = false;
    let sameuser = false;

    if (currUserId == userId) {
        sameuser = true;
    } else if (currUser.reqRec.includes(userId)) {
        reqRec = true;
        console.log(`reqRec entered`);
    } else if (currUser.reqSent.includes(userId)) {
        reqSent = true;
        console.log(`reqSent enterd`);
    } else if (currUser.friends.includes(userId)) {
        friends = true;
        console.log(`friends entered`);
    }

    if (!user) {
        return res.render('search');
    }

    return res.render('user', {
        user,
        sameuser,
        reqRec,
        reqSent,
        friends
    });
}

async function handleAddFriend(req, res) {
    try {
        const targetId = req.params.id;
        const currId = req.user.id;
        const updatedUser = await User.findByIdAndUpdate(currId, {
            $push: {
                reqSent: targetId
            }
        });
        const targetUser = await User.findByIdAndUpdate(targetId, {
            $push: {
                reqRec: currId
            }
        });
        return res.redirect(`/user/info/${targetId}`);
    } catch (err) {
        console.log('Error: ' + err.message);
        return res.render('search');

    }
}

//Not working currently
async function handleRemoveRequest(req, res) {
    try {
        const targetId = new Types.ObjectId(req.params.id);
        const currId = new Types.ObjectId(req.user.id);

        console.log(targetId);
        console.log(currId);

        await User.findByIdAndUpdate(currId, {
            $pop: {
                reqSent: targetId
            }
        });

        await User.findByIdAndUpdate(targetId, {
            $pop: {
                reqRec: currId,
            }
        });

        return res.redirect(`/user/info/${targetId}`);
    } catch (err) {
        console.log('Error: ' + err.message);
        return res.render('search');
    }
}

async function handleDeleteAccount (req, res){
    try{
    const targetId = req.params.id;
    await User.deleteOne({_id: targetId});
    res.clearCookie('token');
    return res.render('signup', {
        success: 'Account deleted successfully'
    })
} catch(err){
    console.log(err.message);
    return res.render('signup');
    
}

}


module.exports = {
    handleGetSignUpPage,
    handleSignUp,
    handleGetSignInPage,
    handleSignIn,
    handleGetSearchPage,
    handleGetSearchUser,
    handleGetUserInfo,
    handleAddFriend,
    handleRemoveRequest,
    handleDeleteAccount
}