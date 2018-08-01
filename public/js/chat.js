var socket = io();

const ul = document.getElementById('messages');
const locationButton = document.getElementById('send-location');

// Scroll to bottom when messages occupy
// full width of the page
function scrollToBottom() {
  var messages = document.getElementById('messages');
  var newMessage = messages.lastElementChild;
  var clientHeight = messages.clientHeight;
  var scrollTop = messages.scrollTop;
  var scrollHeight = messages.scrollHeight;
  var newMessageHeight = newMessage.clientHeight;
  var lastMessageHeight = 0;
  if (newMessage.previousElementSibling) {
    lastMessageHeight = newMessage.previousElementSibling.clientHeight;
  }
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop = scrollHeight;
  }
};

// Get parameters as an object 
// from the join form
function deparam(uri) {
  if (uri === undefined) {
    uri = window.location.search;
  }
  var queryString = {};
  uri.replace(
    new RegExp(
      "([^?=&]+)(=([^&#]*))?", "g"),
      function ($0, $1, $2, $3) {
        queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
      }
    );
  return queryString;
}

// Connect with scpecified room
socket.on('connect', function () {
  var params = deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      document.title = `Chat | ${params.room}`;
    }
  });
});

// Log that disconnection happend
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// Update current list of users
socket.on('updateUserList', function (users) {
  var content = '<ol>';
  users.forEach(function (user) {
    content += `<li>${user}</li>`;
  });
  content += '</ol>';
  document.getElementById('users').innerHTML = content;
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
  scrollToBottom();
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
  scrollToBottom();
});

document.getElementById('message-form').addEventListener('submit', function (e) {
  e.preventDefault();
  let messageInput = document.querySelector('[name=message]');
  socket.emit('createMessage', {text: messageInput.value}, function (data) {
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