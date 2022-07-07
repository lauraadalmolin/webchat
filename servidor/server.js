const express = require('express');

// constants
const PORT = 8080;
const IP_ADDRESS = '192.168.0.111';

// storage
const usernames = new Map();
const clients = new Map();

// helper function
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  
  let color = '#';
  while (color.length < 7) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

const app = express();
const http = require('http');
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`--- Listening on *:${PORT}`);
});

// initiating socket object
const io = require('socket.io')(server, {
  cors: {
    origin: [`http://${IP_ADDRESS}:3000`, 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // add new connection into map of clients
  clients.set(socket, null);

  // log connection event in the terminal
  console.log('# New client connected');
  console.log('-> Number of connections: ', clients.size, '\n');

  // emit connection event
  socket.emit('connection', null);

  // save username information attached to clients map
  socket.on('username_defined', (res) => {
    clients.set(socket, res.username);
  });

  // listen to message event and emit it to other clients
  socket.on('message', (res) => {
    const color = usernames.get(res.author);
    io.emit('message', {...res, color});
  });

  socket.on('disconnect', () => {
    // get username
    const username = clients.get(socket);
    
    // remove current socket from clients 
    clients.delete(socket);

    // release current username
    usernames.delete(username);

    // log into terminal
    console.log(`# Client '${username}' disconnected`);
    console.log('-> Number of connections: ', clients.size, '\n');
  });
});

// HTTP SERVER

// middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    `http://${IP_ADDRESS}:3000`,
    'http://localhost:3000',
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// login route
app.post('/login', (req, res) => {
  const username = req.body.username;
  const isUsernameAvailable = !usernames.has(username);
  
  const response = {
    success: isUsernameAvailable
  };
  
  if (isUsernameAvailable) {
    const color = generateRandomColor();
    usernames.set(username, color);
  } 
  
  res.status = 200;
  res.send(response);
});

