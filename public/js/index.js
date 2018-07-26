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
  const ul = document.getElementById('messages');
  const li = document.createElement('li');
  li.innerHTML = `<li>${message.from}: ${message.text}</li>`;
  ul.appendChild(li);
});

document.getElementById('message-form').addEventListener('submit', function (e) {
  e.preventDefault();
  let name = document.querySelector('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: name.value
  }, function (data) {
    // Get acknowledgement from server
    console.log('Roger!', data);
  });
});