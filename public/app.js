
let device = '';

if (navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)) 
  {
    device = true;
  } else {
      device = false;
  } 

var debugMode = false;

if(debugMode == false)
  {
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
      const table = document.querySelector("#tables");
      const menu = document.querySelector("#menu");
      const chefNotes = document.querySelector("#chef_notes");
      
      const messageBox = document.querySelector("#message_log");
      const menuSize = document.querySelectorAll('#menu .menu_item').length;
      const serverList = document.querySelector("#users");

      function createOrder(){
        var order = [];
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
            //console.log(orderUp);
            socket.emit("send_message", JSON.stringify(orderUp));
            menu.reset();
            table.value = "";
        }
      }

      function createOrderTicket(text) {
        tempText = JSON.parse(text)
        
        const containerElement = document.createElement("div");
        containerElement.className = "container"

        const serverGridElement = document.createElement("div");
        serverGridElement.className = "serverGrid"
        const h2serverGridElement = document.createElement("h2")
        h2serverGridElement.textContent = "Server " + tempText.Server;
        serverGridElement.appendChild(h2serverGridElement)

        const tableGridElement = document.createElement("div")
        tableGridElement.className = "tableGrid"
        const h2tableGridElement = document.createElement("h2");
        h2tableGridElement.textContent = tempText.Table;
        tableGridElement.appendChild(h2tableGridElement)

        const menuGridElement = document.createElement("div");
        menuGridElement.className = "menuGrid"
        const h2MenuElement = document.createElement("h2");
        h2MenuElement.textContent = "Order"
        const ulMenuElement = document.createElement("ul");
        for(i = 0; i < tempText.Order.length; i++){
          const liMenuElement = document.createElement("li");
          liMenuElement.textContent = tempText.Order[i]
          ulMenuElement.appendChild(liMenuElement);
        }
        menuGridElement.appendChild(h2MenuElement);
        menuGridElement.appendChild(ulMenuElement)

        const notesGridElement = document.createElement("div");
        notesGridElement.className = "notesGrid"
        const h3notesGridElement = document.createElement("h2");
        h3notesGridElement.textContent = "Notes to the Chef"
        const pnotesGridElement = document.createElement("p");
        pnotesGridElement.textContent = tempText.Notes
        notesGridElement.appendChild(h3notesGridElement)
        notesGridElement.appendChild(pnotesGridElement)

        containerElement.appendChild(serverGridElement)
        containerElement.appendChild(tableGridElement)
        containerElement.appendChild(menuGridElement)
        containerElement.appendChild(notesGridElement)

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

      });
      
      var alertServerBtn = document.querySelector("#alert_server").addEventListener("click", (click) => {
        // console.log(serverList)
        // console.log(serverList.options[serverList.selectedIndex].text)
        socket.emit("direct_message", serverList.options[serverList.selectedIndex].text, "Your order is ready for pickup")

      })

      var serverLoginBtn = document.querySelector("#server_submit").addEventListener("click", (click) => {
        document.querySelector("#notice").innerText = ""
        document.querySelector("#server_login").style.display = "none";
        serverID = document.querySelector("#server_number").value;
        document.querySelector(".welcome_message").innerHTML = "Welcome Back Server " + serverID;
        socket.emit("server_login", serverID)
      })

      socket.on("connection", (socket) => {
        console.log(socket.id);
      });

      socket.on("receive_message", (message) => {
        createOrderTicket(message);
      });

      socket.on("add_server", (id) => {
        var serverOption = document.createElement("option")
        serverOption.innerHTML = id;
        serverList.appendChild(serverOption)
      });

      socket.on("inner_direct_message", (message) => {
        document.querySelector("#notice").innerText = message
      });