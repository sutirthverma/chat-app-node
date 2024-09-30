const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io')
const io =  new Server(server);

const { makeConnection } = require('./connection');
const PORT = 8000;
const userRouter = require('./routes/user_router');
const messageRouter = require('./routes/message_router');
const { checkForAuthCookie , checkUserLoggedIn, currentUser} = require('./middlewares/auth_middleware');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const User = require('./models/user_model');
const { handleUpdateUserStatus } = require('./controllers/user_controller');

makeConnection('mongodb://localhost:27017/chat-app')
.then(() => console.log(`MongoDB Connected`));


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use( checkForAuthCookie('token') );
//app.use( currentUser());

app.use(express.static(path.resolve('./public')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', checkUserLoggedIn(), async (req, res) => {

    const friendsList = await User.find({
        friends: req.user.id
    });

    return res.render('homepage', {
        user: req.user,
        friendsList
    });
})

app.use('/user', userRouter);
app.use('/message', messageRouter);

//Socket IO
io.on('connection', async (socket) => {
    console.log(`a user connected ${socket.id}`); 
    const userId = socket.handshake.auth.token;
    await User.updateOne({ _id:  userId }, { $set: { is_online: '1' }})

    socket.on('chat message', (message) => {
        console.log(message);
        io.emit('msg', message);
    })

    socket.on('disconnect', async () => {
        console.log(`User disconnected`);
        await User.updateOne({ _id:  userId }, { $set: { is_online: '0' }});

        socket.emit('disconnected');
    })   
})

server.listen(PORT, () => console.log(`Server Started`));