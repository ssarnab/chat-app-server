const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
//
//const socketio = require('socket.io');
//const http = require('http');
import { createServer } from "http";
import { Server } from "socket.io";
//
const cors = require('cors');
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("common"));



const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://chat-app-4u.netlify.app",
  }
});

// const io = require("socket.io")(port, {
//   cors: {
//     origin: "https://chat-app-4u.netlify.app/",
//   },
// });

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

// app.listen(port, () => {
//   console.log("Backend server is running!");
// });
////////

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));

io.on('connect', (socket) => {
   //when ceonnect
   console.log("a user connected.");

   //take userId and socketId from user
   socket.on("addUser", (userId) => {
     addUser(userId, socket.id);
     io.emit("getUsers", users);
   });
 
   //send and get message
   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
     const user = getUser(receiverId);
     io.to(user.socketId).emit("getMessage", {
       senderId,
       text,
     });
   });
 
   //when disconnect
   socket.on("disconnect", () => {
     console.log("a user disconnected!");
     removeUser(socket.id);
     io.emit("getUsers", users);
   });
});


let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId ===  userId);
};

