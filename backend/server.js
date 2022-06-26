const express = require('express');

const app = express();
const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://192.168.0.115:3000', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

const PORT = 8080;
const usernames = new Set();

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

let connections = 0;

io.on('connection', (socket) => {
  connections++;
  console.log('new client connected', connections);
  socket.emit('connection', null);


  socket.on('message', (res) => {
    console.log(res);
    io.emit('message', res);
  });
});

// middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://192.168.0.115:3000',
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

// Login route
app.post('/login', (req, res) => {
  const username = req.body.username;
  const isUsernameAvailable = !usernames.has(username);

  const response = {
    success: isUsernameAvailable
  };
  
  if (isUsernameAvailable) {
    usernames.add(username);
  } 
  
  res.status = 200;
  res.send(response);
});
