"use strict";

var express = require("express");
var app = express();
var port = 3001;

var liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", function () {
  setTimeout(function () {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLiveReload());

app.get("/", function (req, res) {
  res.send("Hello from server!fdsaf");
});

app.listen(port, function () {
  console.log("Example app listening on port " + port);
});