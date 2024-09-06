const http = require('http');
const express = require('express');
const PORT = 8000;
const app = express();
const path = require('path');
const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server);

//Socket io
io.on('connection', (socket) => {
    socket.on('message', message => {
        io.emit('message', message);
    })   
})


app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
    return res.sendFile('/public/index.html');
})

server.listen(PORT, () => console.log(`Server Started At ${PORT}`));
