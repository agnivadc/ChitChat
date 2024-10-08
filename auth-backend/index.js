//index.js

import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("chat msg", (msg) => {
    console.log("Received msg " + msg);

    io.emit("chat msg", msg);
  });
});

app.use(express.json()); // It parses the incoming request body, if any, and populates the req.body property with the parsed JSON data. This allows you to easily access the JSON data sent by clients in HTTP requests.

app.use("/auth", authRouter); // any requests whose path starts with /auth will be routed to the authRouter middleware for further processing

app.get("/", (req, res) => {
  res.send("Welcome to HHLD Chat App!");
});

server.listen(PORT, (req, res) => {
  connectToMongoDB();
  console.log(`Server is running at ${PORT}`);
});
