const { Server } = require('socket.io');

const initSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "http://192.168.0.104:3000", // Frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on("userConnected", (userId) => {
      users[userId] = socket.id; // Map userId to their socket.id
      console.log(`User ${userId} is connected with socket ID ${socket.id}`);
    });

    // Handle events
    socket.on('sendMessage', (message) => {
      console.log('Message received:', message);

      // Broadcast the message to all connected clients
      io.emit('message', message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io; // Return the Socket.IO instance if needed elsewhere
};

module.exports = initSocket;
