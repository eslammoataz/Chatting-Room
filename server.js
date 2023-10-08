const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  deleteUser,
  getRoomUsers,
} = require('./utils/users');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, './public')));

const BOTNAME = 'ChatCord Bot';

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    // join a specific room
    socket.join(user.room);

    // welcome current user
    socket.emit('message', formatMessage(BOTNAME, 'Welcome to the chat app!'));

    // broadcast to everyone except the current user
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(BOTNAME, `${user.username} has joined the chat..!`)
      );

    //send users and room information
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //sent from the main page fornt end
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = deleteUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(BOTNAME, `${user.username} has left!`)
      );

      // updating the users list in the room
      //send users and room information
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log('Server is running on port 3000');
});
