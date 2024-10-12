import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { addMsgToConversation } from "./controllers/msgs.controller.js";
import msgsRouter from "./routes/msgs.route.js";
import { subscribe, publish } from "./redis/msgsPubSub.js";

// dotenv library loads environment variables from .env file into process.env
dotenv.config();
// use the port specified in the environment variable PORT, or default to port 5000
const port = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
  })
);

const server = http.createServer(app);

// io is an instance of the Socket.IO server class that is associated with and attached to the HTTP server
const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: "*",
  },
});

const userSocketMap = {};

// Allow WebSocket connections from different origins to the Socket.IO server by relaxing the browser's same-origin policy

io.on("connection", (socket) => {
  const username = socket.handshake.query.username;
  console.log("Username of connected client:", username);

  userSocketMap[username] = socket;

  // The callback function is executed whenever a message is received on
  // the specified Redis channel. When a message is received,
  // it's passed to this callback function as the msg parameter.

  const channelName = `chat_${username}`;
  subscribe(channelName, (msg) => {
    socket.emit("chat msg", JSON.parse(msg));
  });

  console.log("userSocketMap:", Object.keys(userSocketMap));
  socket.on("chat msg", (msg) => {
    // console.log("Receiver of the message:", msg.receiver);
    const receiverSocket = userSocketMap[msg.receiver];
    if (receiverSocket) {
      receiverSocket.emit("chat msg", msg);
    } else {
      const channelName = `chat_${msg.receiver}`;
      publish(channelName, JSON.stringify(msg));
    }

    addMsgToConversation([msg.sender, msg.receiver], {
      text: msg.text,
      sender: msg.sender,
      receiver: msg.receiver,
    });
  });
});

// When a client connects to the Socket.IO server, a unique socket object is created to represent that client's connection. This socket object allows bidirectional communication between the server and the specific client that it represents.

// Define a route
app.get("/", (req, res) => {
  res.send("Hello Folks!");
});

//route to msgs router
app.use("/msgs", msgsRouter);

// Start the server
server.listen(port, (req, res) => {
  connectToMongoDB();
  console.log(`Server is running at ${port}`);
});
