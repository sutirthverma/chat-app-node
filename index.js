const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io')
const io =  new Server(server);

const { makeConnection } = require('./connection');
const PORT = 8000;
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


//Socket IO
io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`); 

    socket.on('chat message', (message) => {
        console.log(message);        
        io.emit('msg', message);
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected`);        
    })   
})

server.listen(PORT, () => console.log(`Server Started`));