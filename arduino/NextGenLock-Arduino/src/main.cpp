#include <Arduino.h>

// sudo chmod 666 /dev/ttyACM1

#include <SPI.h>
#include <MFRC522.h>

#define SDA_PIN 8   
#define RST_PIN 0  

MFRC522 mfrc522(SDA_PIN, RST_PIN);  // Create MFRC522 instance.

void setup() {
  pinMode(13,OUTPUT);
  Serial.begin(9600);  // Initiate a serial communication
  // SPI.begin();         // Initiate  SPI bus
  // mfrc522.PCD_Init();  // Initiate MFRC522
  // mfrc522.PCD_DumpVersionToSerial();
}

void loop() {
  digitalWrite(13,HIGH);
  delay(1000);
  digitalWrite(13,LOW);
  delay(1000);
  Serial.println("Hello World!");
  // // Look for new cards
  // if (!mfrc522.PICC_IsNewCardPresent()) {
  //   return;
  // }
  // // Select one of the cards
  // if (!mfrc522.PICC_ReadCardSerial()) {
  //   return;
  // }
  // //Show UID on serial monitor
  // Serial.println();
  // Serial.println("HelloWorld");
  // Serial.println();
  // Serial.print(" UID tag :");
  // for (byte i = 0; i < mfrc522.uid.size; i++) {
  //   Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
  //   Serial.print(mfrc522.uid.uidByte[i], HEX);
  // }
  // delay(2000);
}