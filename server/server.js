const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const {msgGenerator, msgLocGenerator} = require('./utils/message');
const {isString} = require('./utils/validator');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname , '../public');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));
let users = new Users();

io.on('connect', (socket) => {
    socket.on('joinRoom', (params, callback) => {
        var param = {
            ...params,
            room: params.room.toLowerCase(),
            name: params.name.toLowerCase()
        }
        if(!isString(param.name)){
            return callback('Display Name can not be empty');
        }else if(!isString(param.room)){
            return callback('Room Name can not be empty');
        }else{
            socket.join(param.room);
            users.removeUser(socket.id);

            if(users.getUserByName(param.name)){
                return callback(`${param.name} is already taken.`);
            }

            users.addUser(socket.id, param.name, param.room);

            io.to(param.room).emit('updatedUsersList', users.getUsersList(param.room));
            socket.emit('newMessage', msgGenerator('Admin', `Welcome to ${param.room}`));
            socket.broadcast.to(param.room).emit('newMessage', msgGenerator('Admin', `${param.name} has joined.`));

            callback();
        }
    })

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);
        
        if(user && isString(message.text)){
            io.to(user.room).emit('newMessage', msgGenerator(user.name, message.text));
        }

        callback();
    });

    socket.on('createLocationMessage', coords => {
        let user = users.getUser(socket.id);

        if(user){
            io.to(user.room).emit('newLocationMessage', msgLocGenerator(user.name, coords));
        }
    });
    
    socket.on('disconnect', () => {
        let user =  users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updatedUsersList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage', msgGenerator('Admin', `${user.name} has left.`));
        }
    });
});


server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})