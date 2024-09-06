const http = require('http');
const express = require('express');
const PORT = 8000;
const app = express();
const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server Started At ${PORT}`));
