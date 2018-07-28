const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

// For Heroku deployment
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);  
var io = socketIO(server);

app.use(express.static(publicPath));

// Creating connection if request came 
// to server from a user and log the message
io.on('connection', (socket) => {
  console.log('New user connected');

  // Send data back to the user that just conected
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  // Send data back to all users that are connected 
  // except the user that made the request 
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  // Getting a message from a user and log it
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    // Send that data to all connected users
    io.emit('newMessage', generateMessage(message.from, message.text));
    // Send confirmation to client
    callback('this is from the server');
  });

  // Getting a message with user's location
  socket.on('createLocationMessage', (coords) => {
    // Send that data to all connected users
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  // Log a message if a user was disconnected
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});


server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
