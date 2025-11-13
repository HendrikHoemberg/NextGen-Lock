// sudo chmod 666 /dev/ttyACM1

#include <Arduino.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10 // Slave PIN
#define RST_PIN 9 // Reset PIN

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.

int pinLED=2;

void setup() 
{
  Serial.begin(9600);   // Initiate a serial communication
  SPI.begin();      // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522
  Serial.println("Please scan your RFID card...");
  Serial.println();
  pinMode(pinLED, OUTPUT);
}

void loop() 
{
  // Wait for RFID cards to be scanned
  if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return;
  }
  // an RFID card has been scanned but no UID 
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }
  //Show UID on serial monitor
  digitalWrite(pinLED,HIGH);
  Serial.print("USER ID tag :");
  String content= "";
 
  for (byte i = 0; i < mfrc522.uid.size; i++) 
  {
     Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
     Serial.print(mfrc522.uid.uidByte[i], HEX);
     content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
     content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  delay(1000);
  digitalWrite(pinLED,LOW);
  Serial.println();
} 


// --------------------------------------------------------------------------------------------------------------------------------
// #define SDA_PIN 8   
// #define RST_PIN 0  

// MFRC522 mfrc522(SDA_PIN, RST_PIN);  // Create MFRC522 instance.

// old setup code
// void setup() {
//   pinMode(13,OUTPUT);
//   Serial.begin(9600);  // Initiate a serial communication
//   SPI.begin();         // Initiate  SPI bus
//   mfrc522.PCD_Init();  // Initiate MFRC522
//   mfrc522.PCD_DumpVersionToSerial();
// }

// old loop code
// void loop() {
//   digitalWrite(13,HIGH);
//   delay(1000);
//   digitalWrite(13,LOW);
//   delay(1000);
//   Serial.println("Hello World!");
//   // Look for new cards
//   if (!mfrc522.PICC_IsNewCardPresent()) {
//     return;
//   }
//   // Select one of the cards
//   if (!mfrc522.PICC_ReadCardSerial()) {
//     return;
//   }
//   //Show UID on serial monitor
//   Serial.println();
//   Serial.println("HelloWorld");
//   Serial.println();
//   Serial.print(" UID tag :");
//   for (byte i = 0; i < mfrc522.uid.size; i++) {
//     Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
//     Serial.print(mfrc522.uid.uidByte[i], HEX);
//   }
//   delay(2000);
// }