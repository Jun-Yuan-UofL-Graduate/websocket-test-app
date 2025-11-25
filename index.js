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
    // Register "image" events, sent by the client

    
    socket.on("server_login", (socketID) => {
      map.set("Server " + socketID, socket.id)
      //socket.broadcast.to(room).emit("add-server", socket.id);
      socket.broadcast.to(room).emit("add_server", "Server " + socketID);
    });

    socket.on("send_message", (message) => {
      // socket.broadcast.to(room).emit("receive_message", socket.id + " " + message)
      socket.broadcast.to(room).emit("receive_message", message)
    })

    socket.on("direct_message", (id, message) => {
      //map.get(id)
      socket.to(map.get(id)).emit("inner_direct_message", message)
    })


    //// Broadcast the "image" event to all other clients in the room
    // socket.on("image", function(msg) {
    //   socket.broadcast.to(room).emit("image", msg);
    // });
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000')
});

// const platform = require('platform')
// const path = require("path");
// const express = require("express");
// const http = require("https");
// const socketIO = require("socket.io");

// const PORT = process.env.PORT || 3000;
// //const INDEX = path.join(__dirname, 'index.html');
// //const INDEX = path.join(__dirname, 'index.html');
// //const INDEX = express.static(path.join(__dirname, 'public'));


//   const server = express()


// var express = require('express');
// var path = require('path');
// var app = express();
// app.use(express.static(path.join(__dirname, 'public')));

//    .use((req, res) => res.sendFile(INDEX) )
//   .listen(PORT, () => console.log("Listening on localhost" + PORT));


// server.use(express.static(path.join(__dirname, 'public')))
// server.get("/", function(req, res) {
//   res.sendFile(__dirname + "/index.html");
// });

// const io = socketIO(http);


// const map = new Map();

// io.on("connection", function(socket) {
//   // Register "join" events, requested by a connected client
//   socket.on("join", function (room) {
//     // join channel provided by client
//     socket.join(room)

//     console.log(socket.id + " Successfully joined a room")
//     // Register "image" events, sent by the client

    
//     socket.on("server_login", (socketID) => {
//       map.set("Server " + socketID, socket.id)
//       //socket.broadcast.to(room).emit("add-server", socket.id);
//       socket.broadcast.to(room).emit("add_server", "Server " + socketID);
//     });

//     socket.on("send_message", (message) => {
//       socket.broadcast.to(room).emit("receive_message", socket.id + " " + message)
//     })

//     socket.on("direct_message", (id, message) => {
//       //map.get(id)
//       socket.to(map.get(id)).emit("inner_direct_message", message)
//     })


//     //// Broadcast the "image" event to all other clients in the room
//     // socket.on("image", function(msg) {
//     //   socket.broadcast.to(room).emit("image", msg);
//     // });
//   })
// });



















// const platform = require('platform')
// const express = require("express");
// const socketIO = require("socket.io");
// const path = require("path");
// const http = require("http");

// const PORT = process.env.PORT || 3000;
// const INDEX = path.join(__dirname, 'index.html');
// //const INDEX = path.join(__dirname, 'index.html');
// //const INDEX = express.static(path.join(__dirname, 'public'));

//  const server = express()
//    .use((req, res) => res.sendFile(INDEX) )
//   .listen(PORT, () => console.log("Listening on localhost" + PORT));
//  const io = socketIO(server);


// const map = new Map();

// io.on("connection", function(socket) {
//   // Register "join" events, requested by a connected client
//   socket.on("join", function (room) {
//     // join channel provided by client
//     socket.join(room)

//     console.log(socket.id + " Successfully joined a room")
//     // Register "image" events, sent by the client

    
//     socket.on("server_login", (socketID) => {
//       map.set("Server " + socketID, socket.id)
//       //socket.broadcast.to(room).emit("add-server", socket.id);
//       socket.broadcast.to(room).emit("add_server", "Server " + socketID);
//     });

//     socket.on("send_message", (message) => {
//       socket.broadcast.to(room).emit("receive_message", socket.id + " " + message)
//     })

//     socket.on("direct_message", (id, message) => {
//       //map.get(id)
//       socket.to(map.get(id)).emit("inner_direct_message", message)
//     })


//     //// Broadcast the "image" event to all other clients in the room
//     // socket.on("image", function(msg) {
//     //   socket.broadcast.to(room).emit("image", msg);
//     // });
//   })
// });











//const express = require('express'); //requires express module
//const socket = require('socket.io'); //requires socket.io module
//const fs = require('fs');
//const app = express();
//var PORT = process.env.PORT || 3000;
//const server = app.listen(PORT); //tells to host server on localhost:3000


////Playing variables:
//app.use(express.static('public')); //show static files in 'public' directory
//console.log('Server is running');
//const io = socket(server);

//var count = 0;


////Socket.io Connection------------------
//io.on('connection', (socket) => {

//    console.log("New socket connection: " + socket.id)

//    socket.on('counter', () => {
//        count++;
//        console.log(count)
//        io.emit('counter', count);
//    })
//})