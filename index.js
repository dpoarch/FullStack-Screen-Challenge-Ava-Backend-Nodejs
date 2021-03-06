const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
var bodyParser = require('body-parser')
const { addUser, removeUser, getUsersInRoom } = require("./users");
const { addMessage, getMessagesInRoom, getConversations, insertMutations } = require("./messages");

const app = express();
app.use(cors());
app.use(bodyParser.json())

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 4000;
const USER_JOIN_CHAT_EVENT = "USER_JOIN_CHAT_EVENT";
const USER_LEAVE_CHAT_EVENT = "USER_LEAVE_CHAT_EVENT";
const NEW_CHAT_MESSAGE_EVENT = "NEW_CHAT_MESSAGE_EVENT";
const START_TYPING_MESSAGE_EVENT = "START_TYPING_MESSAGE_EVENT";
const STOP_TYPING_MESSAGE_EVENT = "STOP_TYPING_MESSAGE_EVENT";

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  // Join a conversation
  const { roomId, name, picture } = socket.handshake.query;
  socket.join(roomId);

  const user = addUser(socket.id, roomId, name, picture);
  io.in(roomId).emit(USER_JOIN_CHAT_EVENT, user);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    const message = addMessage(roomId, data);
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, message);
  });

  // Listen typing events
  socket.on(START_TYPING_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(START_TYPING_MESSAGE_EVENT, data);
  });
  socket.on(STOP_TYPING_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(STOP_TYPING_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.in(roomId).emit(USER_LEAVE_CHAT_EVENT, user);
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`); 
});

app.get("/rooms/:roomId/users", (req, res) => {
  const users = getUsersInRoom(req.params.roomId);
  res.set('Access-Control-Allow-Origin', '*');
  return res.json({ users });
});

app.get("/rooms/:roomId/messages", (req, res) => {
  const messages = getMessagesInRoom(req.params.roomId);
  res.set('Access-Control-Allow-Origin', '*');
  return res.json({ messages });
});

app.get("/conversations", (req, res) => {
  const conversations = getConversations("dev");
  res.set('Access-Control-Allow-Origin', '*');
  return res.json({ conversations });
});

app.get("/ping", (req, res) => {
  const messages = {
  "ok": true,
  "msg": "pong"
  };
  res.set('Access-Control-Allow-Origin', '*');
  return res.json({ messages });
});

app.get("/info", (req, res) => {
  const messages = {
  "ok": true,
  "author": {
    "email": "davidpoarch@outlook.com",
    "name": "David Poarch"
  },
  "frontend": {
    "url": "https://react-node-deployment-dev.herokuapp.com"
  },
  "language": "Node.js",
  "sources": "https://github.com/dpoarch/FullStack-Screen-Challenge-Ava",
  "sourcesBackend": "https://github.com/dpoarch/FullStack-Screen-Challenge-Ava-Backend-Nodejs"
};
  res.set('Access-Control-Allow-Origin', '*');
  return res.json({ messages });
});

app.post("/mutations", (req, res) => {
  if(!req.body.author){
    return res.status(400).json({status: 400, ok:"false", msg: "an error message, if needed"});
  }else{
    var messages = insertMutations(req.body);
  }
  
  return res.json({ messages });
});

// app.listen( || 4000);

