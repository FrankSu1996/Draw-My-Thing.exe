const { instrument } = require("@socket.io/admin-ui");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("send-canvas-data", (canvasData) => {
    io.emit("receive-canvas-data", canvasData);
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

instrument(io, { auth: false });
