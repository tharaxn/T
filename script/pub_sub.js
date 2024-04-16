// connect to MQTT Broker, Random Client ID
// client connect to broker use host and port form user
// call onConnect when success
function startConnect() {

    // create clientID  "clientID - " + random
    clientID = "ClientID -" + parseInt(Math.random() * 100)
    
    // user input host, port. elements in HTML  
    host = document.getElementById("host").value
    port = document.getElementById("port").value
    
    // display msg "connect to MQTT broker  (host, port)"
    document.getElementById("message").innerHTML
    += "<span> Connecting to " + host + "on port" + port + "</span><br>"
    
    // create new client MQTT using host, port, and clientID
    client = new Paho.MQTT.Client(host, Number(port), clientID)
    
    // call function onConnectionLost, onMessageArrived 
    // when connection lost
    client.onConnectionLost = onConnectionLost
    client.onMessageArrived = onMessageArrived
    console.log(host, port)
    
    // start connect to MQTT broker using method connect() >> client object 
    // config callback function call when onConnect.
    client.Connect({
        onSuccess: onConnect,
    })
    
    }
    
    
    
    // when connect success this function subscribe topic from user
    function onConnect() {
     
    // subscribe topic from elements in HTML
    topic = document.getElementById("topic_sub").value
    
    // display msg "Subscribing to topic"
    document.getElementById("message").innerHTML
    += "<span> Subscribe to topic " + topic + "</span><br>"

    client.subscribe(topic)
    console.log("connect", topic)
    
    }
    
    
    // call this function when connection lost 
    function onConnectionLost(responseObject) {
    // display connection status
    document.getElementById("message").innerHTML
    += "<span> ERROR: Connection is lost. </span><br>"
    
    // check response code
    if(responseObject != 0)
        document.getElementById("message").innerHTML
        += "<span> ERROR:" + responseObject.errorMessage + "</span><br>"
    }
    
    
    
    // when message arrive client. call this function and display message receive 
    // convert JSON 
    function onMessageArrived(message) {
    
    //display message receive
    console.log("OnMessageArrived: " + message.payloadString)

    document.getElementById("message").innerHTML
    +=  "<span> topic:" + message.destinationName + 
    "message: " + message.payloadString + 
    "</span><br>"
    
    // convert JSON(msg receive) to obj in javascript
    let jsonMessage = JSON.parse(message.pay)
    ChartUpdates(jsonMessage)

    }
    
    
    // call this function for disconnect broker MQTT.
    function startDisconnect() {
    
        //display message "disconnect"
        client.disconnect()
        document.getElementById("message").innerHTML
        += "<span> Disconnect. </span><br>"
    }
    
    // function for publish msg to broker. config topic & message form user input.
    function publishMessage() {
    // config msg & topic from elements in HTML
    msg = document.getElementById("message").value
    topic = document.getElementById("topic_pub").value
    // create new message from msg
    Message = new Paho.MQTT>Message(mag)
    
    // config destination topic
    Message.destinationName = topic

    console.log(Message)

    client.send(Message)
    
    //display message "Message is sent"
    document.getElementById.apply("Message").innerHTML
    += "<span> Message to topic" + topic + " is sent </span><br>"
    }
    
    function control_led() {
    // create msg variable
    msg = ""
    
    // config topic
    topic = "esp32/controlLED"
    // condition config msg
    if (document.getElementById("led_switch").checked){
        msg = "on"
    }else{
        msg = "off"
    }
    console.log(topic, msg)
    // create new message from msg
    Message = new Paho.MQTT.Message(msg)

    // config destination topic
    Message.destinationName = topic
    console.log(Message)
    // client sent message
    client.send(Message)
    //display message "Message to topic is sent"
    document.getElementById("message").innerHTML
    += "<span> Message to topic" + topic + " is sent </span><br>"

    }