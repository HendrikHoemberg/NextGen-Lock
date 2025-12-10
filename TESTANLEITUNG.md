# NextGen Lock - Testanleitung

## Inhaltsverzeichnis
1. [Hardware-Setup](#hardware-setup)
2. [Software-Installation und Start](#software-installation-und-start)
3. [Benutzer hinzufügen](#benutzer-hinzufügen)
4. [RFID-Karte hinzufügen und zuordnen](#rfid-karte-hinzufügen-und-zuordnen)
5. [System testen](#system-testen)

---

## Hardware-Setup

### Notwendige Komponenten
- Arduino Uno
- RFID-Modul (MFRC522)
- RFID-Karten
- RGB LED Modul (IDUINO ST1090)
- Aktiver Piezo Buzzer (IDUINO SE044)
- Jumper-Kabel
- Breadboard
- USB-Kabel für Arduino

### Aufbau-Schritte

1. **Arduino mit USB verbinden**: Schließen Sie den Arduino Uno mit einem USB-Kabel an Ihren Computer an.

2. **RFID-Modul anschließen**:
   - VCC (Orange) → Arduino 3.3V
   - GND (Braun) → Arduino GND
   - RST (Rot) → Arduino Pin 9
   - SDA (Lila) → Arduino Pin 10
   - MOSI (Weiß) → Arduino Pin 11
   - MISO (Schwarz) → Arduino Pin 12
   - SCK (Grau) → Arduino Pin 13

3. **RGB LED anschließen**:
   - Rot → Arduino Pin 5
   - Grün → Arduino Pin 6
   - Blau → Arduino Pin 7
   - Weiß (GND) → Arduino GND

4. **Buzzer anschließen**:
   - Signal (Weiß) → Arduino Pin 2
   - GND (Braun) → Arduino GND

5. **Alle Kabel überprüfen**: Stellen Sie sicher, dass alle Verbindungen sicher sind und die Kabel richtig eingesteckt sind.

---

## Software-Installation und Start

### Schritt 1: Node.js überprüfen

Überprüfen Sie, ob Node.js installiert ist:

```powershell
node --version
npm --version
```

Falls nicht installiert, laden Sie Node.js von [nodejs.org](https://nodejs.org/) herunter und installieren es.

### Schritt 2: Projekt öffnen

Wählen Sie den Befehl für Ihr Betriebssystem:

**Windows (PowerShell):**
```powershell
cd "C:\Users\snooz\Documents\Coding\NextGen Lock"
```

**Windows (Command Prompt):**
```cmd
cd C:\Users\snooz\Documents\Coding\NextGen Lock
```

**macOS/Linux:**
```bash
cd ~/Documents/Coding/NextGen\ Lock
# oder mit vollständigem Pfad:
cd "/pfad/zum/NextGen Lock"
```

### Schritt 3: Arduino-Code hochladen

1. **Öffnen Sie PlatformIO oder Arduino IDE**

2. **Laden Sie den Arduino-Code hoch**:
   - **Mit PlatformIO**: Klicken Sie auf den Upload-Button (Pfeil-Icon) oder drücken Sie `Ctrl+Alt+U`
   - **Mit Arduino IDE**: Klicken Sie auf Sketch → Upload oder drücken Sie `Ctrl+U`

3. **Überprüfen Sie die serielle Konsole**:
   - **PlatformIO**: Terminal → Serial Monitor
   - **Arduino IDE**: Tools → Serial Monitor
   - Stellen Sie die Baudrate auf `9600` ein

Die RFID-Karten-ID wird in der seriellen Konsole angezeigt, wenn Sie eine Karte vor das Lesegerät halten.

### Schritt 4: Abhängigkeiten installieren und Datenbank initialisieren

Das System stellt Startup-Scripts für jede Plattform bereit. Diese Scripts installieren automatisch alle Abhängigkeiten und initialisieren die Datenbank.

#### Schritt 4a: Datenbank vorbereiten

Vor dem Systemstart muss die Datenbank initialisiert werden. Dies geschieht mit folgendem Befehl:

**Windows (PowerShell/Command Prompt):**
```powershell
cd db
node resetDb.js
```

**macOS/Linux:**
```bash
cd db
node resetDb.js
```

Dies wird:
- ✓ Die vorhandene Datenbank löschen (falls vorhanden)
- ✓ Eine neue Datenbank erstellen
- ✓ Alle notwendigen Tabellen einrichten
- ✓ Mock-Daten einfügen

Nach erfolgreicher Ausführung sollten Sie folgende Meldung sehen:
```
Deleted existing database
Created new database
Tables created
Mock data inserted
```

#### Schritt 4b: System starten

Navigieren Sie zurück zum Hauptverzeichnis:

**Alle Plattformen:**
```bash
cd ..
```

Starten Sie nun das System mit dem entsprechenden Script für Ihr Betriebssystem:

**Windows - PowerShell (empfohlen):**
```powershell
.\start-servers.ps1
```

Falls Sie eine Fehlermeldung erhalten, dass Scripts nicht ausgeführt werden können:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Bestätigen Sie mit `Y` und starten Sie dann erneut:
```powershell
.\start-servers.ps1
```

**Windows - Command Prompt (cmd.exe) oder Batch-Datei:**

Wenn Sie PowerShell nicht verwenden möchten, können Sie alternativ die Batch-Datei ausführen:

```cmd
start-servers.bat
```

Oder doppelklicken Sie im Explorer auf die Datei `start-servers.bat`.

**macOS/Linux:**

Geben Sie zunächst Ausführungsrechte:
```bash
chmod +x start-servers.sh
```

Führen Sie das Script aus:
```bash
./start-servers.sh
```

Das Script wird automatisch:
- ✓ Alle Abhängigkeiten installieren (npm install)
- ✓ Backend-Server auf Port 5000 starten
- ✓ Frontend-Server auf Port 3000 starten
- ✓ Automatisch Ihren Browser öffnen

### System überprüfen

Öffnen Sie Ihren Browser und navigieren Sie zu:
- **Frontend**: [http://localhost:3000](http://localhost:3000)

Wenn die Seite lädt, ist das System erfolgreich gestartet.

**Expected Output - Backend erfolgreich gestartet:**
```
Server running on http://localhost:5000
Database connected
Arduino initialized
```

**Expected Output - Frontend erfolgreich gestartet:**
```
VITE v7.0.0  ready in 500 ms

➜  Local:   http://localhost:3000/
```

### Manuelles Starten (Alternative)

Falls Sie die Komponenten einzeln starten möchten, öffnen Sie mehrere Terminal-Fenster und installieren Sie zuerst die Abhängigkeiten:

**Abhängigkeiten installieren (einmalig):**

#### Windows (PowerShell/Command Prompt)
```powershell
cd backend
npm install
cd ../frontend
npm install
```

#### macOS/Linux
```bash
cd backend
npm install
cd ../frontend
npm install
```

Danach können Sie die einzelnen Services starten:

#### Windows (PowerShell/Command Prompt)

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Terminal 3 - Datenbank (optional):**
```powershell
cd db
node resetDb.js
```

#### macOS/Linux

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Benutzer hinzufügen

### Über die Web-Oberfläche

1. **Öffnen Sie das Frontend**:
   - Navigieren Sie zu [http://localhost:3000](http://localhost:3000)

2. **Gehen Sie zur Benutzer-Seite**:
   - Klicken Sie auf den Menüpunkt **"Benutzer"** oder **"Users"** in der Navigation

3. **Neuen Benutzer erstellen**:
   - Klicken Sie auf die Schaltfläche **"Benutzer hinzufügen"** oder **"Add User"**
   - Geben Sie ein:
     - **Vorname**: z.B. "Max"
     - **Nachname**: z.B. "Mustermann"
   - Klicken Sie auf **"Erstellen"** oder **"Create"**

4. **Bestätigung**:
   - Der neue Benutzer erscheint nun in der Liste
   - Notieren Sie sich die **Benutzer-ID** (wird benötigt für Kartenzuordnung)

### Über die REST API (Alternative)

Sie können auch direkt die API verwenden (z.B. mit Postman oder cURL):

```powershell
$body = @{
    first_name = "Max"
    last_name = "Mustermann"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/users" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

## RFID-Karte hinzufügen und zuordnen

### Schritt 1: Karte in der Web-Oberfläche hinzufügen

1. **Öffnen Sie das Frontend**:
   - Navigieren Sie zu [http://localhost:3000](http://localhost:3000)

2. **Gehen Sie zur RFID-Karten-Seite**:
   - Klicken Sie auf den Menüpunkt **"RFID-Karten"** oder **"RFID Cards"**

3. **Neue Karte registrieren**:
   - Klicken Sie auf **"Karte hinzufügen"** oder **"Add Card"**
   - Geben Sie ein:
     - **Karten-ID**: Die ausgelesene Karten-ID 
     (z.B. `A1 B2 C3 D4`)
     - **Benutzer**: Wählen Sie den Benutzer aus der Liste, dem die Karte gehören soll
     - **Autorisiert**: Aktivieren Sie das Kontrollkästchen, um die Karte zu autorisieren
   - Klicken Sie auf **"Erstellen"** oder **"Create"**

4. **Bestätigung**:
   - Die Karte erscheint nun in der Liste als autorisiert
   - Sie ist jetzt einsatzbereit

### Schritt 2: Karte autorisieren/widerrufen

1. **In der RFID-Karten-Liste**:
   - Suchen Sie die entsprechende Karte
   - Klicken Sie auf das Icon oder die Schaltfläche neben der Karte

2. **Autorisierung ändern**:
   - **Autorisieren**: Grüner Button - erteilt Zugriff
   - **Widerrufen**: Roter Button - entzieht Zugriff

### Über die REST API (Alternative)

Karte erstellen:
```powershell
$body = @{
    card_id = "A1B2C3D4"
    user_id = 1
    authorized = $true
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/cards" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

Karte autorisieren:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/cards/A1B2C3D4/authorize" `
  -Method PATCH
```

Karte deautorisieren:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/cards/A1B2C3D4/revoke" `
  -Method PATCH
```

---

## System testen

### Test 1: Dashboard-Übersicht

1. **Öffnen Sie das Dashboard**:
   - Navigieren Sie zu [http://localhost:3000](http://localhost:3000)

2. **Überprüfen Sie folgende Informationen**:
   - Anzahl der Benutzer
   - Anzahl der RFID-Karten
   - Letzte 5 Zugriffsvorgänge mit Status

**Erwartetes Ergebnis**: Alle erstellten Benutzer und Karten werden angezeigt

### Test 2: Benutzer-Verwaltung

1. **Gehen Sie zur Benutzer-Seite**

2. **Überprüfen Sie**:
   - ✓ Liste zeigt alle Benutzer
   - ✓ Neuer Benutzer kann hinzugefügt werden
   - ✓ Benutzer können bearbeitet werden
   - ✓ Benutzer können gelöscht werden

### Test 3: RFID-Karten-Verwaltung

1. **Gehen Sie zur RFID-Karten-Seite**

2. **Überprüfen Sie**:
   - ✓ Liste zeigt alle Karten mit zugeordneten Benutzern
   - ✓ Neue Karte kann hinzugefügt werden
   - ✓ Karte kann autorisiert/deautorisiert werden
   - ✓ Karte kann gelöscht werden

### Test 4: Hardware-Test (RFID-Leser)

1. **Stelle sicher, dass der Arduino richtig mit dem Computer verbunden ist**

2. **Öffne die serielle Konsole des Arduino**:
   - In Arduino IDE: Tools → Serial Monitor
   - In Platform IO: Terminal → Serial Monitor

3. **Halte eine RFID-Karte vor den Leser**:
   - Die Karten-ID sollte in der seriellen Konsole angezeigt werden

4. **Überprüfe die LED-Anzeigen**:
   - **Grün**: Karte autorisiert - Zugriff gewährt
   - **Rot**: Karte nicht autorisiert - Zugriff verweigert
   - **Blau**: System initialisiert sich

5. **Überprüfe den Buzzer**:
   - Bei erfolgreicher Authentifizierung: 1 kurzer Ton
   - Bei abgelehrtem Zugriff: 3 kurze Töne

### Test 5: Zugriffslogs

1. **Gehen Sie zur Seite "Zugriffslogs"**

2. **Führen Sie mehrere Kartentests durch**:
   - Lesen Sie autorisierte Karten
   - Lesen Sie nicht-autorisierte Karten
   - Lesen Sie Karten von verschiedenen Benutzern

3. **Überprüfen Sie die Logs**:
   - ✓ Jeder Kartenzugriff wird protokolliert
   - ✓ Zeitstempel sind korrekt
   - ✓ Autorisierungsstatus ist korrekt angezeigt

---

## Fehlerbehebung

### Problem: Arduino wird nicht erkannt

**Lösung**:
1. Überprüfen Sie das USB-Kabel
2. Überprüfen Sie den COM-Port

### Problem: RFID-Karte wird nicht gelesen

**Lösung**:
1. Überprüfen Sie die Pin-Verbindungen (siehe Hardware-Setup)
2. Überprüfen Sie die SPI-Kommunikation in der seriellen Konsole

### Problem: Frontend lädt nicht

**Lösung**:
1. Überprüfen Sie, dass der Frontend-Server läuft (Port 3000)
2. Löschen Sie den Browser-Cache
3. Öffnen Sie die Browser-Konsole (F12) auf Fehler überprüfen

### Problem: Backend antwortet nicht

**Lösung**:
1. Überprüfen Sie, dass der Backend-Server läuft (Port 5000)
2. Überprüfen Sie die Node.js-Konsole auf Fehler
3. Starten Sie den Backend-Server neu

### Problem: Datenbank ist beschädigt

**Lösung**:
1. Löschen Sie die Datei `db/nextgenlock.db`
2. Führen Sie erneut aus: `node resetDb.js`
3. Starten Sie das System neu

