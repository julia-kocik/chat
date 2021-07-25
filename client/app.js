const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
let userName;

const socket = io();

//socket.on('message', (event) => addMessage(event.author, event.content))
socket.on('message', ({ author, content }) => addMessage(author, content))
socket.on('join', (event) => addMessage(`ChatBot`, `${event} has joint the conversation!`));
socket.on('removeUser', (event) => addMessage('ChatBot', `${event.name} has left the conversation... :(`));

const login = (e) => {
    e.preventDefault();
    if(!userNameInput.value.length) {
        alert('error')
    } else {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        socket.emit('join', userName)
    }
}

const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) {
        message.classList.add('message--self');
    } else if(author === 'ChatBot') {
      message.classList.remove('message--received');
      message.classList.add('message--service');
    }
    message.innerHTML = `
    <h3 class="message__author">${userName === author ? "You": author}</h3>
    <div class="message__content">${content}</div>
    `;
    messagesList.appendChild(message);
}

function sendMessage(e) {
    e.preventDefault();
  
    let messageContent = messageContentInput.value;
  
    if(!messageContent.length) {
      alert('You have to type something!');
    }
    else {
      addMessage(userName, messageContent);
      socket.emit('message', { author: userName, content: messageContent })
      messageContentInput.value = '';
    }
  
  }

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);

