// socket.js

const socketIO = require("socket.io");
const Room = require("../models/userSchema.js");

const createRoom = async (io, data) => {

};

const storeNewMessage = async (io, data) => {
  try {
    console.log("Create room event received:", data);
    const isDataExists = await Room.findOne({ ...data });
    if (isDataExists?._id) {
      throw new Error(`${data.name} already exists`);
    }
    const room = await new Room(data).save();

    if (room) {
      io.emit("roomCreated", { success: true, roomId: room._id });
    }
  } catch (error) {
    // Emit an error event to the client
    io.emit("roomCreated", {
      message: "An error occurred while creating the room",
      success: false,
      error: error.message,
    });
  }
};

const initSocketServer = (server) => {
  try {
    // Initialize socket.io with the HTTP server instance
    const io = socketIO(server);

    // Setup a default connection event
    io.on("connection", (socket) => {
      console.log(`A user connected: ${socket.id}`);

      // Emit a message indicating that the socket server is running
      console.log("Socket server is running and waiting for events...");

      // Create a room (sample event handler)
      socket.on("createRoom", async (data) => {
        createRoom(io, data);
      });

      socket.on("newMessage", async (data) => {
        createRoom(io, data);
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
