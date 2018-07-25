var socket = io();

// Log that connection was set successfully
socket.on('connect', function () {
  console.log('Connected to server');
});

// Log that disconnection happend
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// Log that a message from server received
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});

/* To emit a custom event from console of the Google Dev tools:
> socket.emit('createMessage', {from: 'Billy', text: 'This is Billy Bones'});
*/