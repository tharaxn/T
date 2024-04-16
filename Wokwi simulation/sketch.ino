#include "DHT.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
int LED = 2;
bool ledState = false;
#define DHTPIN 14 
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

// WiFi settings
const char *ssid = "Wokwi-GUEST"; // Replace with your WiFi name
const char *password = "";  // Replace with your WiFi password

// MQTT Broker settings
const char *mqtt_broker = "broker.emqx.io"; // EMQX broker endpoint
const char *mqtt_topic = "esp32/controlLED"; // MQTT topic

const int mqtt_port = 1883; // MQTT port (TCP)

WiFiClient espClient;
PubSubClient mqtt_client(espClient);

void connectToWiFi();

void connectToMQTTBroker();

void mqttCallback(char *topic, byte *payload, unsigned int length);

void setup() {
 Serial.begin(115200);
 pinMode(LED, OUTPUT);
 dht.begin();
 connectToWiFi();
 mqtt_client.setServer(mqtt_broker, mqtt_port);
 mqtt_client.setCallback(mqttCallback);
 connectToMQTTBroker();
}

void connectToWiFi() {
 WiFi.begin(ssid, password);
 Serial.print("Connecting to WiFi");
 while (WiFi.status() != WL_CONNECTED) {
 delay(500);
 Serial.print(".");
   }
 Serial.println("\nConnected to the WiFi network");
}

void connectToMQTTBroker() {
 while (!mqtt_client.connected()) {
 String client_id = "esp32-client-" + String(WiFi.macAddress());
 Serial.printf("Connecting to MQTT Broker as %s.....\n", client_id.c_str());
 if (mqtt_client.connect(client_id.c_str())) {
 Serial.println("Connected to MQTT broker");
 mqtt_client.subscribe(mqtt_topic);
 // Publish message upon successful connection
 mqtt_client.publish(mqtt_topic, "Hi EMQX I'm ESP32 ^^");
 } else {
 Serial.print("Failed to connect to MQTT broker, rc=");
 Serial.print(mqtt_client.state());
 Serial.println(" try again in 5 seconds");
 delay(5000);
 }
 }
}

void mqttCallback(char *topic, byte *payload, unsigned int length) {
 Serial.print("Message received on topic: ");
 Serial.println(topic);
 Serial.print("Message:");
 String message;
 for (int i = 0; i < length; i++) {
 message += (char) payload[i]; // Convert *byte to string
   }
 // Control the LED based on the message received
 if (message == "on" && !ledState) {
 digitalWrite(LED, HIGH); // Turn on the LED
 ledState = true;
 Serial.println("LED is turned on");
  }
 if (message == "off" && ledState) {
 digitalWrite(LED, LOW); // Turn off the LED
 ledState = false;
 Serial.println("LED is turned off");
   }
 Serial.println();
 Serial.println("-----------------------");
}

void loop() {
 if (!mqtt_client.connected()) {
 connectToMQTTBroker();
   }
 mqtt_client.loop();
 long now = millis();
  long previous_time = 0;
  
  if (now - previous_time > 1000) {
    previous_time = now;
    
  float humidity = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float temperature = dht.readTemperature();

  DynamicJsonDocument doc(512);
  doc ["temp"] = temperature;
  doc ["humid"] = humidity;

  String buffer;
  serializeJson(doc, buffer);
 
  mqtt_client.publish("esp32/temp-humid", buffer.c_str());

  Serial.println(humidity);
  Serial.println(temperature);
  Serial.println("-----------------------");
  delay(2000);
}
}