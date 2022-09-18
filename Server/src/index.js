const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
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
