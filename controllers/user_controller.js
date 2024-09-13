const User = require("../models/user_model");
const { createUserToken } = require("../services/authentication");

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
        const { email, password } = req.body;

        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log(token);


        const user = await User.findOne({
            email,
            password
        });

        return res.cookie('token', token).redirect('/');
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

    if (!user) {
        return res.render('search');
    }

    return res.render('user', {
        user
    });
}

module.exports = {
    handleGetSignUpPage,
    handleSignUp,
    handleGetSignInPage,
    handleSignIn,
    handleGetSearchPage,
    handleGetSearchUser,
    handleGetUserInfo
}