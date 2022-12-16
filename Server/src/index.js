const { instrument } = require("@socket.io/admin-ui");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost",
      "http://localhost:3000",
      "https://admin.socket.io",
      "https://drawmything.herokuapp.com/",
    ],
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

  socket.on("send-stop-drawing", () => {
    io.emit("receive-stop-drawing");
  });

  socket.on("send-start-drawing", (canvasData) => {
    io.emit("receive-start-drawing", canvasData);
  });

  socket.on("send-clear-canvas", () => {
    io.emit("receive-clear-canvas");
  });

  socket.on("send-canvas-undo", (canvasData) => {
    io.emit("receive-canvas-undo", canvasData);
  });
  socket.on("send-canvas-redo", (canvasData) => {
    io.emit("receive-canvas-redo", canvasData);
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

instrument(io, { auth: false, namespaceName: "test" });
