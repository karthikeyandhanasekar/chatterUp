const io = require("socket.io-client");
const socket = io("http://localhost:5000"); // Your server URL

// Once connected to the server, emit the 'createRoom' event
socket.on("connect", () => {
  console.log("Connected to the server with ID:", socket.id);

  // Trigger the createRoom event and pass the necessary data
  socket.emit("createRoom", { name: "MyNewRoom2" }); // You can pass more data as needed

  socket.emit("newMessage", {
    roomId: "675a8e58cfaf1a6a7530e8dc",
    message: "socket message",
    userId: "675a69398ac91352808a3824",
  });
});

socket.on("newMessageSuccess", (data) => {
  console.log({ data });
});

socket.on("newMessageError", (error) => {
  console.log({ error });
});

// Listen for the roomCreated response from the server
socket.on("roomCreated", (message) => {
  console.log("Received message from server:", message);
});

// Optionally, handle disconnect event
socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});
