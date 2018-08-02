const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Users} = require('./utils/users');
const {isRealString} = require('./utils/validation');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

// For Heroku deployment
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);  
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.ticket)) {
      return callback('Name and ticket number are required.');
    }
    // if (!isCorrectTicket(params.ticket)) {
    //   return callback('The ticket number is incorrect.');
    // }

    // Strip log name
    params.name = (params.name.length > 18) ? params.name.slice(0, 18) : params.name;
    socket.join(params.ticket);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.ticket);
    io.to(params.ticket).emit('updateUserList', users.getUserList(params.ticket));
    socket.emit('newMessage', generateMessage('Support', `${params.name}, welcome to the customer support. How can we help you?`));
    socket.broadcast.to(params.ticket).emit('newMessage', generateMessage('Support', `${params.name} has joined.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.ticket).emit('newMessage', generateMessage(user.name, message.text));
    } 
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.ticket).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.ticket).emit('updateUserList', users.getUserList(user.ticket));
      io.to(user.ticket).emit('newMessage', generateMessage('Support', `${user.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
