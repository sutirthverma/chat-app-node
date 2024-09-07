const express = require('express');
const { makeConnection } = require('./connection');
const PORT = 8000;
const app = express();
const userRouter = require('./routes/user_router');
const { checkForAuthCookie , checkUserLoggedIn} = require('./middlewares/auth_middleware');
const cookieParser = require('cookie-parser');

makeConnection('mongodb://localhost:27017/chat-app')
.then(() => console.log(`MongoDB Connected`));


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use( checkForAuthCookie('token') );

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', checkUserLoggedIn(), (req, res) => {
    return res.render('homepage');
})
app.use('/user', userRouter);

app.listen(PORT, () => console.log(`Server Started`));