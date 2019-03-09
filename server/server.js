const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const {msgGenerator, msgLocGenerator} = require('./utils/message');

const publicPath = path.join(__dirname , '../public');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connect', (socket) => {
    console.log('Connected to Client');

    socket.emit('newMessage', msgGenerator('Admin', 'Welcome to the Chat App'));

    socket.broadcast.emit('newMessage', msgGenerator('Admin', 'New user joined'))

    socket.on('createMessage', (message, callback) => {
        console.log('New Message ', message);
        io.emit('newMessage', msgGenerator(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', coords => {
        console.log('New Location Message ', coords);
        
        io.emit('newLocationMessage', msgLocGenerator('User', coords));    
    });
    
    socket.on('disconnect', () => {
        console.log('Disconnected from Client');
    });
});


server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})