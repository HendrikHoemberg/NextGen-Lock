// sudo chmod 666 /dev/ttyACM1

#include <Arduino.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10 // Slave PIN
#define RST_PIN 9 // Reset PIN

#define LED_R_PIN 5 // Access denied
#define LED_G_PIN 6 // Access granted
#define LED_B_PIN 7 // rfid card/chip detected
#define BUZZER 2 // Buzzer

#define LED_ON HIGH
#define LED_OFF LOW

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.

enum ledState {
  ACCESS_GRANTED,
  ACCESS_DENIED,
  RFID_DETECTED,
  IDLE
};

void setStatusLED(enum ledState state) {
  switch(state) {
    case ACCESS_GRANTED:
      digitalWrite(LED_R_PIN, LED_OFF);
      digitalWrite(LED_G_PIN, LED_ON);
      digitalWrite(LED_B_PIN, LED_OFF); 
      break;
    case ACCESS_DENIED:
      digitalWrite(LED_R_PIN, LED_ON);
      digitalWrite(LED_G_PIN, LED_OFF);
      digitalWrite(LED_B_PIN, LED_OFF); 
      break;
    case RFID_DETECTED:
      digitalWrite(LED_R_PIN, LED_OFF);
      digitalWrite(LED_G_PIN, LED_OFF);
      digitalWrite(LED_B_PIN, LED_ON); 
      break;
    case IDLE:
      digitalWrite(LED_R_PIN, LED_OFF);
      digitalWrite(LED_G_PIN, LED_OFF);
      digitalWrite(LED_B_PIN, LED_OFF); 
      break;      
  }
}

void setup() 
{
  Serial.begin(9600);   // Initiate a serial communication
  SPI.begin();      // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522
  Serial.println("Please scan your RFID card...");
  Serial.println();

  // pinMode(pinLED, OUTPUT);

  pinMode(LED_R_PIN, OUTPUT);
  pinMode(LED_G_PIN, OUTPUT);
  pinMode(LED_B_PIN, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  setStatusLED(IDLE);
}

void loop() 
{
  // Wait for RFID cards to be scanned
  if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    setStatusLED(IDLE);
    return;
  }
  // an RFID card has been scanned but no UID 
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    setStatusLED(IDLE);
    return;
  }
  
  // Build UID string
  String content = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) 
  {
     content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
     content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  content.toUpperCase();
  
  // Show blue LED while waiting for backend response
  for (int i = 0; i < 3; i++) {
      setStatusLED(RFID_DETECTED);
      delay(250); 
      setStatusLED(IDLE);
      delay(250);  
  }
  
  // Send UID to backend via serial after blinking completes
  Serial.print("USER ID tag :");
  Serial.println(content);
  
  // Wait for response from backend (max 5 seconds)
  unsigned long startTime = millis();
  String response = "";
  
  while (millis() - startTime < 5000) {
    if (Serial.available() > 0) {
      response = Serial.readStringUntil('\n');
      response.trim();
      break;
    }
    delay(50);
  }
  
  // Process response
  if (response == "GRANTED") {
    // Access granted - green LED and 2 second continuous beep
    setStatusLED(ACCESS_GRANTED);
    digitalWrite(BUZZER, HIGH);
    delay(2000);
    digitalWrite(BUZZER, LOW);
  } else {
    // Access denied - red LED and 3 short beeps in 1.5 seconds
    setStatusLED(ACCESS_DENIED);
    for (int i = 0; i < 3; i++) {
      digitalWrite(BUZZER, HIGH);
      delay(250);  // 250ms beep
      digitalWrite(BUZZER, LOW);
      delay(250);  // 250ms pause (total 500ms per beep, 1.5s for 3 beeps)
    }
  }
  
  // Return to idle
  delay(500);
  setStatusLED(IDLE);
} 
