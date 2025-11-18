# Next-Gen Lock Frontend

React + Tailwind CSS Frontend für das RFID-Zugangssystem "Next-Gen Lock".

## Team: Die Grimmigen
- Julian Naumann
- Hendrik Hömberg

## Technologie-Stack

- **React 18** - UI Framework
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client
- **date-fns** - Datum-Formatierung
- **Lucide React** - Icons

## Installation

1. Abhängigkeiten installieren:
```bash
npm install
```

2. Entwicklungsserver starten:
```bash
npm run dev
```

Der Server läuft standardmäßig auf `http://localhost:3000`.

## Funktionen

### 1. Dashboard (`/`)
- Übersicht über alle wichtigen Statistiken
- Anzahl Benutzer und RFID-Karten
- Letzte 5 Zugangsversuche mit Status
- Echtzeit-Updates

### 2. Zugriffsprotokolle (`/logs`)
- Vollständige Liste aller Zugangsversuche
- Filter nach Status (gewährt/verweigert)
- Suchfunktion nach UID oder Notiz
- Zeitstempel und detaillierte Informationen

### 3. Benutzer-Verwaltung (`/users`)
- Benutzer anlegen, bearbeiten, löschen
- Übersicht der zugeordneten RFID-Karten
- Direkte Navigation zu Benutzer-Karten
- Loading States und Duplikat-Schutz

### 4. RFID-Karten-Verwaltung (`/cards`)
- Karten anlegen und verwalten
- Autorisierung erteilen/widerrufen mit Echtzeit-Feedback
- Zuordnung zu Benutzern
- Filter nach Autorisierungsstatus
- Benutzer-Name Suchfilter
- URL-basierte Filterung (`/cards?user=123`)
- Loading States für alle Aktionen

### 5. Arduino Integration
- Automatische Erkennung des Arduino über SerialPort
- RFID-Karte scannen → Backend prüft Autorisierung
- **Blaue LED** - Warten auf Backend-Antwort
- **Grüne LED + 2s Dauerton** - Zugang gewährt
- **Rote LED + 3x Piepton** - Zugang verweigert
- Automatisches Logging aller Zugriffsversuche

## System-Architektur

### Datenfluss bei RFID-Scan:
1. Arduino liest RFID-Karte
2. Sendet UID via Serial an Backend
3. Backend prüft in Datenbank ob Karte autorisiert
4. Speichert Zugriffsversuch in access_log
5. Sendet `GRANTED` oder `DENIED` zurück an Arduino
6. Arduino zeigt entsprechende LED/Buzzer-Kombination

### API-Konfiguration

Das Frontend kommuniziert über Vite Proxy mit dem Backend:

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

## Datenmodell

### Users (Benutzer)
- `user_id` - Eindeutige ID
- `first_name` - Vorname
- `last_name` - Nachname
- `created_at` - Registrierungszeitpunkt

### RFID Cards (RFID-Karten)
- `card_id` - Karten-UID (Primary Key, z.B. "A1 B2 C3 D4")
- `user_id` - Zugeordneter Benutzer (Foreign Key)
- `authorized` - Autorisierungsstatus (0/1)
- `added_on` - Registrierungszeitpunkt

### Access Logs (Zugriffsprotokolle)
- `log_id` - Eindeutige ID
- `card_uid` - Ausgelesene UID
- `access_time` - Zeitpunkt
- `access_granted` - Zugriff erlaubt (ja/nein)
- `note` - Optionale Bemerkung

## Erwartete Backend-Endpoints

### Users
- `GET /api/users` - Alle Benutzer
- `GET /api/users/:id` - Einzelner Benutzer
- `POST /api/users` - Benutzer erstellen
- `PUT /api/users/:id` - Benutzer aktualisieren
- `DELETE /api/users/:id` - Benutzer löschen

### RFID Cards
- `GET /api/cards` - Alle Karten (mit JOIN auf user Tabelle)
- `GET /api/cards/:cardId` - Einzelne Karte (card_id als Parameter)
- `GET /api/users/:userId/cards` - Karten eines Benutzers
- `POST /api/cards` - Karte erstellen (benötigt: card_id, user_id, authorized)
- `PUT /api/cards/:cardId` - Karte aktualisieren
- `DELETE /api/cards/:cardId` - Karte löschen
- `PATCH /api/cards/:cardId/authorize` - Karte autorisieren
- `PATCH /api/cards/:cardId/revoke` - Autorisierung widerrufen
- `GET /api/cards/:cardId/verify` - Prüft Autorisierungsstatus (für Testing)

### Access Logs
- `GET /api/logs` - Alle Protokolle (mit Query-Parametern)
- `GET /api/logs/:id` - Einzelnes Protokoll
- `GET /api/logs/recent?limit=10` - Letzte n Protokolle

## Build für Produktion

```bash
npm run build
```

Die Build-Dateien werden im `dist/` Ordner erstellt.

## Vorschau der Produktions-Version

```bash
npm run preview
```

## Projektstruktur

```
NextGen Lock/
├── arduino/
│   └── NextGenLock-Arduino/
│       ├── src/
│       │   └── main.cpp         # Arduino Code mit RFID & Serial
│       ├── platformio.ini       # PlatformIO Konfiguration
│       └── include/
├── backend/
│   ├── server.js                # Express Server mit SQLite & SerialPort
│   ├── package.json             # Backend Dependencies
│   └── README.md
├── db/
│   ├── nextgenlock.db          # SQLite Datenbank
│   ├── setupTables.sql         # Datenbank Schema
│   └── generateMockup.sql      # Test-Daten
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Dashboard mit Statistiken
│   │   │   ├── AccessLogs.jsx   # Zugriffsprotokolle
│   │   │   ├── UsersPage.jsx    # Benutzerverwaltung
│   │   │   └── RFIDCards.jsx    # RFID-Kartenverwaltung
│   │   ├── services/
│   │   │   └── api.js           # Axios API Client
│   │   ├── App.jsx              # React Router Setup
│   │   └── main.jsx             # Entry Point
│   ├── vite.config.js           # Vite mit API Proxy
│   └── package.json             # Frontend Dependencies
├── start-servers.bat            # Windows Batch Starter
├── start-servers.ps1            # Windows PowerShell Starter
├── start-servers.sh             # Linux Bash Starter
└── README.md                    # Diese Datei

```

## Arduino Hardware Setup

### Komponenten
- Arduino Board (Uno, Nano, etc.)
- MFRC522 RFID Reader
- RGB LED (oder 3 separate LEDs)
  - Pin 5: Rot (Access Denied)
  - Pin 6: Grün (Access Granted)
  - Pin 7: Blau (RFID Detected - inverse Logik)
- Buzzer an Pin 2
- MFRC522 Pins:
  - SS: Pin 10
  - RST: Pin 9
  - SPI: Standard Arduino SPI Pins

### Verdrahtung
```
MFRC522    -> Arduino
SDA (SS)   -> Pin 10
SCK        -> Pin 13
MOSI       -> Pin 11
MISO       -> Pin 12
RST        -> Pin 9
3.3V       -> 3.3V
GND        -> GND

LED Rot    -> Pin 5 (mit 220Ω Widerstand)
LED Grün   -> Pin 6 (mit 220Ω Widerstand)
LED Blau   -> Pin 7 (mit 220Ω Widerstand, inverse Logik)
Buzzer     -> Pin 2
```

## Hinweise

- Backend läuft auf Port 5000
- Frontend Dev-Server auf Port 3000
- Arduino wird automatisch über SerialPort erkannt (COM/ttyACM/ttyUSB)
- Datenbank liegt in `/db/nextgenlock.db`
- Alle Dependencies werden automatisch durch die Starter-Skripte installiert

