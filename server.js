const express = require('express');
const path = require('path');
const socket = require('socket.io');

const messages = [];
const users = [];

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "/client")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/index.html"));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => {
     console.log('Oh, I\'ve got something from ' + socket.id) 
     messages.push(message);
     socket.broadcast.emit('message', message);
  });
  socket.on('join', (userName) => {
    users.push({name: `${userName}`, id: `${socket.id}`});
    //console.log('New user has joined conversation')
    console.log(users);
    socket.broadcast.emit('join', userName);
  })
  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left') 
    users.forEach(user => {
      if(user.id == socket.id){
          const index = users.indexOf(user);
          socket.broadcast.emit('removeUser', user);
          users.splice(index, 1);
      }
  }); 
  });
  console.log('I\'ve added a listener on message and disconnect events \n');
});