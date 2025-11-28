

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



    var debugMode = false;

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
        var emptyField = 0;
        var okOrder = true;

        for (i = 1; i < menuSize + 1; i++){
          var menuItem = document.querySelector("#item_" + i.toString()).value;
          var labelItem = document.querySelector("#label_" + i.toString()).innerHTML;

          if(menuItem < 0){
            document.querySelector("#notice").innerText = "Invalid Menu Item detected"
            console.log("Invalid Menu Item detected")
            okOrder = false;
            break;
          }else{
            if(menuItem != "" && menuItem != 0){
              labelItem = labelItem.slice(0, -2)
              console.log(menuItem + " x " + labelItem)
              order.push(menuItem + " x " + labelItem)
            }else{
              emptyField++;
            }
          }  
          
        }
        
        if(emptyField == menuSize){
          okOrder = false;
          document.querySelector("#notice").innerText = "Cannot send empty order";
          console.log("Cannot send empty order")
        }
        console.log(order)

        if(okOrder){
            var orderUp = {
              "Server": document.querySelector("#server_number").value,
              "Table": table.options[table.selectedIndex].text,
              "Order": order,
              "Notes": chefNotes.value
            }
            document.querySelector("#notice").innerText = "";
            console.log(orderUp);
            socket.emit("send_message", JSON.stringify(orderUp));
            menu.reset();
            table.value = "";
        }

        // return order;
      }

      function createMessage(text) {
        tempText = JSON.parse(text)
        
        const containerElement = document.createElement("div");
        containerElement.className = "container"

        const orderElement = document.createElement("div");
        orderElement.className = "header"
        orderElement.textContent = "Server " + tempText.Server;
        const headerElement = document.createElement("div")
        headerElement.className = "menu"
        headerElement.textContent = tempText.Table;

        const tableElement = document.createElement("div");
        tableElement.className = "content"
        const h2MenuElement = document.createElement("h2");
        h2MenuElement.textContent = "Order"
        const ulMenuElement = document.createElement("ul");
        for(i = 0; i < tempText.Order.length; i++){
          const liMenuElement = document.createElement("li");
          liMenuElement.textContent = tempText.Order[i]
          ulMenuElement.appendChild(liMenuElement);
        }
        tableElement.appendChild(h2MenuElement);
        tableElement.appendChild(ulMenuElement)

        const footerElement = document.createElement("div");
        footerElement.className = "footer"
        const h3FooterElement = document.createElement("h2");
        h3FooterElement.textContent = "Notes to the Chef"
        const pFooterElement = document.createElement("p");
        pFooterElement.textContent = tempText.Notes
        footerElement.appendChild(h3FooterElement)
        footerElement.appendChild(pFooterElement)

        containerElement.appendChild(orderElement)
        containerElement.appendChild(headerElement)
        containerElement.appendChild(tableElement)
        containerElement.appendChild(footerElement)

        messageBox.appendChild(containerElement)
      }

      var chefBtn = document.querySelector("#chef_button").addEventListener("click", () => {
        if(document.querySelector("#server_number").value == ""){
          console.log("Error! Server not logged in!");
          document.querySelector("#notice").innerText = "Error! Log in first"
        }else{
          if(table.value == ""){
            console.log("Error! No table selected")
            document.querySelector("#notice").innerText = "Error! Select a table"
          }else{
            createOrder();
          }
        }

        // const testPack = document.createElement("input");
        // testPack.type="checkbox"
        // testPack.className = "checkBox";
        // messageBox.appendChild(testPack)

      });
      
      var toServerBtn = document.querySelector("#alert_server").addEventListener("click", (click) => {
        console.log(serverList)
        console.log(serverList.options[serverList.selectedIndex].text)
        socket.emit("direct_message", serverList.options[serverList.selectedIndex].text, "This is a specific message")

      })

      var serverLoginBtn = document.querySelector("#server_submit").addEventListener("click", (click) => {
        document.querySelector("#notice").innerText = ""
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
        document.querySelector("#notice").innerText = "Your order is ready for pickup"
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