const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const usersList = document.getElementById('users');
const roomName = document.getElementById('room-name');

// Get the current URL
const url = new URL(window.location.href);

// Get the search parameters from the URL
const searchParams = new URLSearchParams(url.search);

// Retrieve specific query parameters
const username = searchParams.get('username');
const room = searchParams.get('room');

socket.on('message', (messageFormat) => {
  outputMessage(messageFormat);
  //fix scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Joining Chat Room sending username and room to the server
socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

chatForm.addEventListener('submit', (e) => {
  //it automatically sumbits to a file so we need to prevent that
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit('chatMessage', msg);

  //clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//output message to DOM " DOM manipulation"
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.user}<span> ${message.time}</span></p>
  <p class = 'text' > ${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
  console.log(room);
  roomName.innerText = room;
}

function outputUsers(users) {
  // Remove all child elements (list items) from the UL
  while (usersList.firstChild) {
    usersList.removeChild(usersList.firstChild);
  }

  for (let user of users) {
    const newList = document.createElement('li');
    newList.textContent = `${user.username}`;
    usersList.appendChild(newList);
  }
}
