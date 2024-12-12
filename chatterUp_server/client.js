const io = require("socket.io-client");
const socket = io("http://localhost:3000"); // Your server URL

// Once connected to the server, emit the 'createRoom' event
socket.on("connect", () => {
  console.log("Connected to the server with ID:", socket.id);

  // Trigger the createRoom event and pass the necessary data
  socket.emit("createRoom", { name: "MyNewRoom2" }); // You can pass more data as needed

  socket.emit("newMessage", {
    roomId: "675a61ba156d8e6794a7ef68",
    senderId: "675a63d653b9365932330636",
    message: "Hi",
  });
});

// Listen for the roomCreated response from the server
socket.on("roomCreated", (message) => {
  console.log("Received message from server:", message);
});

// Optionally, handle disconnect event
socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});
