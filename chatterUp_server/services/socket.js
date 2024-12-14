// socket.js

const socketIO = require("socket.io");
const { socketCreateMessage } = require("../controllers/userControllers");

const initSocketServer = (server) => {
  try {
    // Initialize socket.io with the HTTP server instance
    const io = socketIO(server, {});

    // Setup a default connection event
    io.on("connection", (socket) => {
      console.log(`A user connected: ${socket.id}`);

      // Emit a message indicating that the socket server is running
      console.log("Socket server is running and waiting for events...");
      socket.on("newMessage", async (data) => {
        await socketCreateMessage(socket, data);
      });

      // Handle user disconnection
      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    // Emit a log message when the server is initialized and ready
    console.log(
      "Socket.IO server initialized and listening for connections..."
    );

    return io; // Return the io instance in case you need it elsewhere
  } catch (error) {
    console.error("Error initializing Socket.IO server:", error);
  }
};

module.exports = initSocketServer;
