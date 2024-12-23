// socket.js

const socketIO = require("socket.io");
const { socketCreateMessage } = require("../controllers/userControllers");

let socketIo = null;

const initSocketServer = (server) => {
  try {
    socketIo = socketIO(server, {
      transports: "polling",
      cors: {
        origin: "http://localhost:3000", // Replace with your client's URL
        methods: ["GET", "POST"],
      },
    });

    socketIo.on("connection", (socket) => {
      console.log(`A user connected: ${socket.id}`);

      // Join a room
      socket.on("welcomeRoom", async (data) => {
        console.log({ data });

        data.roomIds.forEach(async (roomId) => {
          const localData = { ...data };
          localData.roomId = roomId;
          localData.messageType = "banner";
          await socketCreateMessage(socket, localData);
        });
      });

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

      socket.on("leaveRoom", async (data) => {
        console.log(data);
        const localData = { ...data };
        localData.messageType = "banner";
        await socketCreateMessage(socket, localData);
        console.log(`Socket ${socket.id} left room ${data.roomId}`);
      });

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    console.log("Socket.IO server initialized...");
    return socketIo;
  } catch (error) {
    console.error("Error initializing Socket.IO server:", error);
  }
};
const useSocket = () => socketIo;
module.exports = { initSocketServer, useSocket };
