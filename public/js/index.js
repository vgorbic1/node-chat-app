var socket = io();

const ul = document.getElementById('messages');
const locationButton = document.getElementById('send-location');

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
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = document.getElementById('message-template').innerHTML;
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  ul.insertAdjacentHTML('beforeend', html);
});

// Create a message with user's current location 
socket.on('newLocationMessage', function (message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = document.getElementById('location-message-template').innerHTML;
  let html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  ul.insertAdjacentHTML('beforeend', html);
});

document.getElementById('message-form').addEventListener('submit', function (e) {
  e.preventDefault();
  let messageInput = document.querySelector('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageInput.value
  }, function (data) {
    // Get acknowledgement from server
    messageInput.value = '';
    messageInput.focus();
  });
});

locationButton.addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.setAttribute('disabled', 'disabled');
  locationButton.textContent = 'Sending...';

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttribute('disabled');
    locationButton.textContent = 'Send location';
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttribute('disabled')
    locationButton.textContent = 'Send location';
    alert('Unable to fetch location.');
  });
});