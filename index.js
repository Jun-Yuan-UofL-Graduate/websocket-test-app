const platform = require('platform')
const express = require("express");
 const socketIO = require("socket.io");
 const path = require("path");
 
 const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const CHEFPATH = path.join(__dirname, 'chefPage.html');

 const server = express()
   .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log("Listening on localhost" + PORT));

 const io = socketIO(server);

if (platform.isMobile) {
  console.log("Mobile device detected");
} else {
  console.log("Desktop device detected");
}

 io.on("connection", function(socket) {
   socket.on("join", function (room) {
     socket.join(room)
     socket.on("image", function(msg) {
       socket.broadcast.to(room).emit("image", msg);
     });
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