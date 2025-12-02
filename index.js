var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const express = require("express");

app.get("/", function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});
app.use(express.static(__dirname + '/public'));

const map = new Map();

io.on('connection', function(socket){
    // Register "join" events, requested by a connected client
  socket.on("join", function (room) {
    // join channel provided by client
    socket.join(room)

    console.log(socket.id + " Successfully joined a room")
 
    socket.on("server_login", (socketID) => {
      map.set("Server " + socketID, socket.id)
      socket.broadcast.to(room).emit("add_server", "Server " + socketID);
    });

    socket.on("send_message", (message) => {
      // socket.broadcast.to(room).emit("receive_message", socket.id + " " + message)
      socket.broadcast.to(room).emit("receive_message", message)
    })

    socket.on("direct_message", (id, message) => {
      socket.to(map.get(id)).emit("inner_direct_message", message)
    })

  })
});

http.listen(3000, function(){
  console.log('listening on *:3000')
});