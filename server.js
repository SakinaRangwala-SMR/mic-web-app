const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));

io.on("connection", socket => {
  console.log("A device connected:", socket.id);

  socket.on("audioData", data => {
    socket.broadcast.emit("playAudio", data);
  });
});

http.listen(3000, () => console.log("Server running on http://localhost:3000"));
