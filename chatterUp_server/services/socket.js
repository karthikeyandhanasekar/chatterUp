// socket.js

const socketIO = require("socket.io");
const { socketCreateMessage } = require("../controllers/userControllers");
const { transports } = require("winston");
const initSocketServer = (server) => {
  try {
    const io = socketIO(server, {
      transports: "polling",
      cors: {
        origin: "http://localhost:3000", // Replace with your client's URL
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log(`A user connected: ${socket.id}`);

      // Join a room
      socket.on("joinRoom", ({ roomId, userId }) => {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
        socket.emit("roomJoined", `User ${userId} joined room ${roomId}`);
      });

      socket.on("typing", async (data) => {
        socket.to(data.roomId).emit("isTyping", data);
        socket.emit("isTyping", data);
      });

      socket.on("newMessage", async (data) => {
        await socketCreateMessage(socket, data);
      });

      socket.on("leaveRoom", ({ roomId }) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
      });

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    console.log("Socket.IO server initialized...");
    return io;
  } catch (error) {
    console.error("Error initializing Socket.IO server:", error);
  }
};

module.exports = initSocketServer;
