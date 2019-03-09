const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname , '../public');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connect', (socket) => {
    console.log('Connected to Client');
    
    socket.on('disconnect', () => {
        console.log('Disconnected from Client');
    });
});


server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})