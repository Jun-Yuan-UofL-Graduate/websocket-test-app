

let device = '';

    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        device = true;
    } else {
        device = false;
    }
    console.log(device);



    var debugMode = true;

    if(debugMode == false){
      if(device == true){
            var elements = document.querySelector("#desktop_UI");
                  elements.style.display = 'none';
      }else{
            var elements = document.querySelector("#mobile_UI");
                  elements.style.display = 'none';
      }
    }

      // Get WebSocket
      //var socket = io("https://websocket-test-app.onrender.com");
      var socket = io();

      // Join a channel
      var room = "test";
      socket.emit("join", room);
      
      // Get DOM elements
      var input = document.getElementById("input");
      var output = document.getElementById("output");

      const messageBox = document.querySelector("#message_log");
      var chefNotes = document.getElementById("chef_notes");
      var table = document.querySelector("#tables");
      const menuSize = document.querySelectorAll('#menu .menu_item').length
      const menu = document.querySelector("#menu");

      function createOrder(){
        var order = [];
        var item = "";
        

        for (i = 1; i < menuSize + 1; i++){
          var menuItem = document.querySelector("#item_" + i.toString()).value;
          var labelItem = document.querySelector("#label_" + i.toString()).innerHTML;

          if(menuItem != ""){
            labelItem = labelItem.slice(0, -2)
            console.log(menuItem + " x " + labelItem)
            order.push(menuItem + " x " + labelItem)
          }
          
        }
        
        console.log(order)

        return order;
      }

      function createMessage(text, ownMessage = false) {
        //console.log("Gonna create message: " + text)

        // const messageElement = document.createElement("div");
        const messageElement = document.createElement("ul");
        messageElement.className = "chat_message";

        //const subMesssageElement = document.createElement("div");

        const subMesssageElement = document.createElement("div");
        subMesssageElement.className =
          "px-4 py-4 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600";
        if (ownMessage) {
          subMesssageElement.className += " float-right bg-blue-800 text-white";
        }
        subMesssageElement.innerText = text;
        messageElement.appendChild(subMesssageElement);

        

        messageBox.appendChild(messageElement);

        //subMesssageElement.innerText = "How is this?";
        //messageElement.appendChild(subMesssageElement)
      }

      var chefBtn = document.querySelector("#chef_button").addEventListener("click", () => {
        if(table.value == ""){
          console.log("Error! No table selected")
          document.querySelector("#notice").innerText = "Error! Select a table"
        }else{
          document.querySelector("#notice").innerText = ""
          console.log(table.value)
          console.log(table.options[table.selectedIndex].text)
        console.log("Send to Chef")
        var holdThis = createOrder();
        //console.log(holdThis);


        // const testPack = document.createElement("input");
        // testPack.type="checkbox"
        // testPack.className = "checkBox";
        // messageBox.appendChild(testPack)

          // console.log(serverID = document.querySelector("#server_number").value);
          // console.log(document.querySelector("#server_number").value);
          socket.emit("send_message", "Server " + document.querySelector("#server_number").value);
          createMessage("Server " + document.querySelector("#server_number").value)

          socket.emit("send_message", table.options[table.selectedIndex].text)
          createMessage(table.options[table.selectedIndex].text, true);

          for (i = 0; i < holdThis.length; i ++){
            socket.emit("send_message", holdThis[i])
            createMessage(holdThis[i], true)
          }

          if (chefNotes.value != "" ){
            socket.emit("send_message", chefNotes.value);
            createMessage(chefNotes.value, true);
          }

          menu.reset();
          table.value = "";
        }

      });
      
      var toServerBtn = document.querySelector("#alert_server").addEventListener("click", (click) => {
        console.log(serverList)
        console.log(serverList.options[serverList.selectedIndex].text)
        socket.emit("direct_message", serverList.options[serverList.selectedIndex].text, "This is a specific message")

      })

      var serverLoginBtn = document.querySelector("#server_submit").addEventListener("click", (click) => {
        document.querySelector("#server_login").style.display = "none";
        serverID = document.querySelector("#server_number").value;
        document.querySelector("#welcome_message").innerHTML = "Welcome Back to the Restaurant Server " + serverID;
        socket.emit("server_login", serverID)
      })

      socket.on("connection", (socket) => {
        console.log(socket.id);
      });

      socket.on("receive_message", (message) => {
        createMessage(message);
      });


      const serverList = document.querySelector("#users")

      socket.on("add_server", (id) => {
        var serverOption = document.createElement("option")
        serverOption.innerHTML = id;
        serverList.appendChild(serverOption)
      });

      

      socket.on("inner_direct_message", () => {
        document.querySelector("#notice").innerText = "This message is beamed into your mind"
      })
      


      

      // // Listen to file input events
      // document.getElementById("input").addEventListener("change", function (event) {

      //   // Prepeare file reader
      //   var file = event.target.files[0];
      //   var fileReader = new FileReader();

      //   fileReader.onloadend = function (event) {
      //     // Send an image event to the socket
      //     var image = event.target.result
      //     output.src = image;
      //     socket.emit("image", image);
      //   };

      //   // Read file
      //   fileReader.readAsDataURL(file);
      // })

      // socket.on("image", function (image) {
      //   output.src = image;
      // });