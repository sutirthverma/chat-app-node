const { validateToken } = require("../services/authentication");

function checkForAuthCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies?.[cookieName];

        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (err) {
            console.log(err.message);
        }

        next();
    }
}

function checkUserLoggedIn() {
    return (req, res, next) => {
        try {
            const token = req.cookies?.token;

            if (!token) {
                return res.redirect('/user/signin')
            }

            validateToken(token);
            next();
        } catch (err) {
            console.log(err.message);
            return res.redirect('/user/signin')
        }
    }
}

function currentUser(){
    return (req, res, next) => {
        try{
            const token = req.cookies?.token;

            if (!token) {
                next();
            }

            const userPayload = validateToken(token);
            req.user = userPayload;
            next();
        }catch(err){
            console.log(err.message);
            return res.redirect('/user/signin');
        }
    }
}

module.exports = {
    checkForAuthCookie,
    checkUserLoggedIn,
    currentUser
}