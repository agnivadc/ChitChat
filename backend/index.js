import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// dotenv library loads environment variables from .env file into process.env
dotenv.config();
// use the port specified in the environment variable PORT, or default to port 5000
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

// io is an instance of the Socket.IO server class that is associated with and attached to the HTTP server
const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: "*",
  },
});

// Allow WebSocket connections from different origins to the Socket.IO server by relaxing the browser's same-origin policy

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("chat msg", (msg) => {
    console.log("Received msg " + msg);
    socket.broadcast.emit("chat msg", msg);
    // io.emit("chat msg", msg);
  });
});

// When a client connects to the Socket.IO server, a unique socket object is created to represent that client's connection. This socket object allows bidirectional communication between the server and the specific client that it represents.

// Define a route
app.get("/", (req, res) => {
  res.send("Hello Folks!");
});

// Start the server
server.listen(port, (req, res) => {
  console.log(`Server is running at ${port}`);
});
