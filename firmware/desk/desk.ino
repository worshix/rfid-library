#include <Wire.h>
#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>

// —— PIN DEFINITIONS ——
// LEDs & buzzer on DIP pins:
#define LED_POWER_PIN  4    // PD3 = Arduino D3
#define LED_SCAN_PIN   3    // PD4 = Arduino D4
#define BUZZER_PIN     2    // PD2 = Arduino D2

// RC522 on hardware SPI:
//   SS  = DIP16 → PB2 → D10
//   RST = DIP12 → PD6 → D6
#define SS_PIN   10
#define RST_PIN   6

// I2C LCD @ 0x27, 16 cols × 2 rows
LiquidCrystal_I2C lcd(0x27, 16, 2);

// RFID object
MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  // Serial to NodeMCU
  Serial.begin(9600);

  // LEDs & buzzer
  pinMode(LED_POWER_PIN, OUTPUT);
  digitalWrite(LED_POWER_PIN, HIGH);
  pinMode(LED_SCAN_PIN, OUTPUT);
  digitalWrite(LED_SCAN_PIN, LOW);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // I²C LCD init
  Wire.begin();
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("Initializing...");
  delay(1500);
  lcd.clear();
  lcd.print("Scan book");

  // RFID init
  SPI.begin();
  mfrc522.PCD_Init();
}

void loop() {
  // 1) Local RFID scan
  if (mfrc522.PICC_IsNewCardPresent() &&
      mfrc522.PICC_ReadCardSerial()) {

    // Build UID string
    String tag;
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      if (mfrc522.uid.uidByte[i] < 0x10) tag += '0';
      tag += String(mfrc522.uid.uidByte[i], HEX);
    }
    tag.toUpperCase();

    // Flash scan LED + buzzer
    digitalWrite(LED_SCAN_PIN, HIGH);
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(LED_SCAN_PIN, LOW);

    // LCD updates
    lcd.clear();
    lcd.print("Book Scanned");
    delay(800);
    lcd.clear();
    lcd.print("Processing...");
    delay(800);
    lcd.clear();
    lcd.print("Scan book");

    // Send raw UID over Serial
    Serial.println(tag);

    // Cleanup RFID
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();

    delay(500);
  }
}
