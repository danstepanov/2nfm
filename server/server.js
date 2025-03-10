const path = require('path');
const url = require('url');
const http = require('http');

const port = process.env.PORT || 9001;

const server = http.createServer((request, response) => {
  // Allow CORS with credentials
  const origin = request.headers.origin || '*';
  response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', 'true');

  if (request.method === 'OPTIONS') {
    response.writeHead(200);
    response.end();
    return;
  }

  const uri = url.parse(request.url).pathname;
  if (uri === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('RTCMultiConnection Socket.io Server is running.');
    response.end();
    return;
  }
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.write('404 Not Found: ' + path.join('/', uri));
  response.end();
});

// Create socket.io server with updated configuration
const io = require('socket.io')(server, {
  cors: {
    origin: true,
    methods: [ 'GET', 'POST' ],
    credentials: true,
  },
  allowEIO3: true,
  transports: [ 'websocket', 'polling' ],
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 1e8,
});

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('join-room', (roomId, userId) => {
    console.log('Join room request:', roomId, userId);
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      console.log('User disconnected:', userId);
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });

  socket.on('get-public-rooms', (publicRoomIdentifier, callback) => {
    const rooms = Array.from(io.sockets.adapter.rooms.keys())
      .filter((room) => room.startsWith(publicRoomIdentifier))
      .map((room) => ({
        roomId: room,
        participants: io.sockets.adapter.rooms.get(room).size,
      }));
    callback(rooms);
  });
});

server.listen(port, () => {
  console.log('Server is running on port', port);
});

// Error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});