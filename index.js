const platform = require('platform')
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const http = require("http");

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
//const CHEFPATH = path.join(__dirname, 'chefPage.html');


 const server = express()
   .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log("Listening on localhost" + PORT));
 const io = socketIO(server);

//  const app = express()
//  const server2 = http.createServer(app)
//  const io2 = new socketIO(server);

// app.get('/chefPage', (req, res) => {
//   res.sendFile(__dirname + '/chefPage.html');
//  })

// let device = '';

//     if (navigator.userAgent.match(/Android/i)
//         || navigator.userAgent.match(/webOS/i)
//         || navigator.userAgent.match(/Windows Phone/i)) {
//         device = true;
//     } else {
//         device = false;
//     }
//     console.log(device);


// console.log(platform.isMobile)
// if (device) {
//   const server = express()
//    .use((req, res) => res.sendFile(CHEFPATH) )
//   .listen(PORT, () => console.log("Listening on localhost" + PORT));
//  const io = socketIO(server);
//   console.log("Mobile device detected");
// } else {
// const server = express()
//    .use((req, res) => res.sendFile(INDEX) )
//   .listen(PORT, () => console.log("Listening on localhost" + PORT));
//  const io = socketIO(server);
//   console.log("Desktop device detected");
// }

io.on("connection", function(socket) {
  // Register "join" events, requested by a connected client
  socket.on("join", function (room) {
    // join channel provided by client
    socket.join(room)
    console.log(socket.id + " Successfully joined a room")
    // Register "image" events, sent by the client

    
    socket.broadcast.to(room).emit("add-server", socket.id)
    

    socket.on("image", function(msg) {
      // Broadcast the "image" event to all other clients in the room
      socket.broadcast.to(room).emit("image", msg);
    });
    socket.on("send-message", (message) => {
      socket.broadcast.to(room).emit("receive-message", socket.id + " " + message)
    })


    socket.on("direct-message", (id, message) => {
      socket.to(id).emit("inner-direct-message", message)
    })
  })
});


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