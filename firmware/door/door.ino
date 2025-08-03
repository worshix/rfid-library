#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Wi‑Fi credentials
const char* ssid     = "TheLight";
const char* password = "musikana30";

// Server route
const char* serverHost = "http://192.168.92.18:3000/api/microcontroller";

// RC522 pins
#define RST_PIN D2
#define SS_PIN  D4

// Extras
#define BUZZER_PIN D0   // GPIO16
#define LED_PIN    D1   // GPIO5

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  SPI.begin();
  mfrc522.PCD_Init();

  Serial.print("Connecting to Wi‑Fi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Connected!");
    Serial.print("IP Address: "); Serial.println(WiFi.localIP());
    digitalWrite(LED_PIN, HIGH);
  } else {
    Serial.println("\n❌ Failed to connect to Wi‑Fi.");
  }

  Serial.println("Ready. Scan an RFID card, or send a tag over Serial.");
}

// helper to POST a tag with given position
void postTag(const String &rfidTag, const char* position) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi‑Fi not connected, skipping POST.");
    return;
  }

  WiFiClient client;
  HTTPClient http;
  http.begin(client, serverHost);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"rfidTag\":\"" + rfidTag + "\",\"position\":\"" + String(position) + "\"}";
  int code = http.POST(payload);

  if (code > 0) {
    Serial.print("POST Success, code="); Serial.println(code);
    Serial.println("Response: " + http.getString());
  } else {
    Serial.print("POST failed, code="); Serial.println(code);
  }
  http.end();
}

void loop() {
  // ——— 1) RFID scan ———
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String rfidTag;
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      if (mfrc522.uid.uidByte[i] < 0x10) rfidTag += "0";
      rfidTag += String(mfrc522.uid.uidByte[i], HEX);
    }
    rfidTag.toUpperCase();

    Serial.print("Scanned UID: "); Serial.println(rfidTag);

    // buzzer beep
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);

    postTag(rfidTag, "door");   // <-- position = "door"

    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    delay(500);
  }

  // ——— 2) Listen for incoming tags over Serial ———
  if (Serial.available()) {
    String incoming = Serial.readStringUntil('\n');
    incoming.trim();
    if (incoming.length() > 0) {
      Serial.print("Received via Serial: "); Serial.println(incoming);
      postTag(incoming, "desk");  // <-- position = "desk"
    }
  }
}
