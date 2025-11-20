# NextGen Lock - RFID Access Control System

Full-stack RFID access control system with Arduino hardware integration, React frontend, and Express.js backend.

## Team: Die Grimmigen
- Julian Naumann
- Hendrik Hömberg

## Technologie-Stack

### Frontend
- **React 19** - UI Framework
- **Vite 7** - Build Tool & Dev Server
- **Tailwind CSS 4** - Styling with PostCSS
- **React Router DOM 7** - Navigation
- **Axios** - HTTP Client
- **date-fns 4** - Datum-Formatierung
- **Lucide React** - Icons

### Backend
- **Node.js** with **Express 4** - Web Server
- **better-sqlite3** - SQLite Database Driver
- **SerialPort** - Arduino Communication
- **CORS** - Cross-Origin Resource Sharing

### Hardware
- **Arduino** - Microcontroller (PlatformIO)
- **MFRC522** - RFID Reader Module
- **RGB LED** - Status Indicators
- **Buzzer** - Audio Feedback

## Installation & Setup

### Quick Start (All Platforms)

Use the provided starter scripts to launch frontend, backend, and database setup:

**Windows:**
```bash
# PowerShell
.\start-servers.ps1

# Or Command Prompt
start-servers.bat
```

**Linux/Mac:**
```bash
chmod +x start-servers.sh
./start-servers.sh
```

These scripts automatically:
- Install all dependencies (npm install)
- Set up the SQLite database
- Start the backend server (Port 5000)
- Start the frontend dev server (Port 3000)
- Open your browser to http://localhost:3000

### Manual Installation

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm start
```

**Database:**
```bash
cd db
node resetDb.js
```

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
- Confirm Modal zur Sicherheit bei Löschvorgängen

### 4. RFID-Karten-Verwaltung (`/cards`)
- Karten anlegen und verwalten
- Autorisierung erteilen/widerrufen mit Echtzeit-Feedback
- Zuordnung zu Benutzern
- Filter nach Autorisierungsstatus
- Benutzer-Name Suchfilter
- URL-basierte Filterung (`/cards?user=123`)
- Loading States für alle Aktionen
- Confirm Modal zur Sicherheit bei Löschvorgängen

### 5. Arduino Integration
- Automatische Erkennung des Arduino über SerialPort
- RFID-Karte scannen → Backend prüft Autorisierung
- **Blaue LED** - Warten auf Backend-Antwort
- **Grüne LED + 2s Dauerton** - Zugang gewährt
- **Rote LED + 3x kurze Pieptöne (je 250ms)** - Zugang verweigert
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
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

Die API-Services sind in `frontend/src/services/api.js` strukturiert mit drei Hauptmodulen:
- `usersAPI` - Benutzerverwaltung
- `cardsAPI` - RFID-Kartenverwaltung
- `logsAPI` - Zugriffsprotokolle

## Datenmodell (SQLite)

### Users (Benutzer)
- `user_id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `first_name` - TEXT NOT NULL
- `last_name` - TEXT NOT NULL
- `created_at` - TEXT (datetime) DEFAULT now()

### RFID Cards (RFID-Karten)
- `card_uid` - TEXT PRIMARY KEY (z.B. " A1 B2 C3 D4")
- `user_id` - INTEGER (Foreign Key → user.user_id, ON DELETE SET NULL)
- `authorized` - INTEGER (0/1) DEFAULT 0
- `added_on` - TEXT (datetime) DEFAULT now()

### Access Logs (Zugriffsprotokolle)
- `log_id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `card_uid` - TEXT NOT NULL
- `access_time` - TEXT (datetime) DEFAULT now()
- `access_granted` - INTEGER (0/1) NOT NULL
- `note` - TEXT (z.B. "Card not registered", "Access granted")

**Hinweis:** PRAGMA foreign_keys = ON ist aktiviert

## Backend API Endpoints

### Users
- `GET /api/users` - Alle Benutzer (ORDER BY created_at DESC)
- `GET /api/users/:id` - Einzelner Benutzer
- `POST /api/users` - Benutzer erstellen (body: first_name, last_name)
- `PUT /api/users/:id` - Benutzer aktualisieren (body: first_name, last_name)
- `DELETE /api/users/:id` - Benutzer löschen

### RFID Cards
- `GET /api/cards` - Alle Karten mit JOIN (c.*, u.first_name, u.last_name)
- `GET /api/cards/:cardId` - Einzelne Karte mit User-Info
- `GET /api/users/:userId/cards` - Karten eines Benutzers
- `POST /api/cards` - Karte erstellen (body: card_id, user_id?, authorized?)
- `PUT /api/cards/:cardId` - Karte aktualisieren (body: user_id, authorized)
- `DELETE /api/cards/:cardId` - Karte löschen
- `PATCH /api/cards/:cardId/authorize` - Karte autorisieren
- `PATCH /api/cards/:cardId/revoke` - Autorisierung widerrufen
- `GET /api/cards/:cardId/verify` - Prüft Autorisierungsstatus (für Testing)

### Access Logs
- `GET /api/logs` - Alle Protokolle (Query: access_granted, limit, offset)
- `GET /api/logs/:id` - Einzelnes Protokoll
- `GET /api/logs/recent?limit=10` - Letzte n Protokolle (ORDER BY access_time DESC)

### Arduino Serial Communication
Das Backend lauscht automatisch auf Serial-Daten vom Arduino:
- **Format vom Arduino:** `"USER ID tag : XX XX XX XX"` (z.B. " A1 B2 C3 D4")
- **Backend-Verarbeitung:**
  1. Extrahiert UID aus Serial-Nachricht
  2. Konvertiert zu Großbuchstaben
  3. Sucht Karte in Datenbank
  4. Prüft `authorized` Status
  5. Erstellt Log-Eintrag in `access_log`
  6. Sendet Antwort zurück
- **Format zum Arduino:** `GRANTED\n` oder `DENIED\n`
- **Timeout:** Arduino wartet max. 5 Sekunden auf Antwort

## Build für Produktion

**Frontend:**
```bash
cd frontend
npm run build
```
Die Build-Dateien werden im `frontend/dist/` Ordner erstellt.

**Vorschau der Produktions-Version:**
```bash
npm run preview
```

**Backend:**
```bash
cd backend
npm start  # Production mode
# oder
npm run dev  # Development mode mit nodemon
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
│   ├── nextgenlock.db          # SQLite Datenbank (wird generiert)
│   ├── setupTables.sql         # Datenbank Schema (CREATE TABLE)
│   ├── generateMockup.sql      # Test-Daten (INSERT Statements)
│   └── resetDb.js              # Node.js Skript zum DB-Setup
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Dashboard mit Statistiken
│   │   │   ├── AccessLogs.jsx   # Zugriffsprotokolle
│   │   │   ├── UsersPage.jsx    # Benutzerverwaltung
│   │   │   └── RFIDCards.jsx    # RFID-Kartenverwaltung
│   │   ├── components/
│   │   │   └── ConfirmModal.jsx # Bestätigungs-Dialog für Löschvorgänge
│   │   ├── services/
│   │   │   ├── api.js           # Axios API Client (usersAPI, cardsAPI, logsAPI)
│   │   │   ├── dummyData.js     # Mock-Daten für Entwicklung
│   │   │   └── testapi.js       # API-Tests
│   │   ├── App.jsx              # React Router Setup
│   │   ├── App.css              # App-Styles
│   │   ├── index.css            # Global Styles + Tailwind
│   │   └── main.jsx             # Entry Point
│   ├── index.html               # HTML Template
│   ├── vite.config.js           # Vite mit API Proxy
│   ├── tailwind.config.js       # Tailwind CSS 4 Config
│   ├── postcss.config.js        # PostCSS Config
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
  - Pin 7: Blau (RFID Detected)
- Buzzer an Pin 2
- MFRC522 Pins:
  - SS: Pin 10
  - RST: Pin 9
  - SPI: Standard Arduino SPI Pins

### LED Status-Maschine
Der Arduino verwendet ein `ledState` Enum mit 4 Zuständen:
- **IDLE** - Alle LEDs aus, wartet auf RFID-Karte
- **RFID_DETECTED** - Blaue LED an, wartet auf Backend-Antwort
- **ACCESS_GRANTED** - Grüne LED an + Buzzer 2s Dauerton
- **ACCESS_DENIED** - Rote LED an + Buzzer 3x 250ms Piep (insgesamt 1.5s)

### Buzzer-Muster
- **Zugang gewährt:** 2 Sekunden Dauerton
- **Zugang verweigert:** 3 kurze Pieptöne (je 250ms Ton + 250ms Pause)

### Verdrahtung
```
MFRC522    -> Arduino
SDA (SS)   -> Pin 10 (SS_PIN)
RST        -> Pin 9 (RST_PIN)
SCK        -> Pin 13 (Standard SPI)
MOSI       -> Pin 11 (Standard SPI)
MISO       -> Pin 12 (Standard SPI)
3.3V       -> 3.3V
GND        -> GND

LED Rot    -> Pin 5 (LED_R_PIN, mit 220Ω Widerstand)
LED Grün   -> Pin 6 (LED_G_PIN, mit 220Ω Widerstand)
LED Blau   -> Pin 7 (LED_B_PIN, mit 220Ω Widerstand)
Buzzer     -> Pin 2 (BUZZER)
```

## Hinweise & Troubleshooting

### Ports
- Backend läuft auf Port **5000**
- Frontend Dev-Server auf Port **3000**
- Arduino kommuniziert über SerialPort (9600 Baud)

### Arduino
- Wird automatisch erkannt über SerialPort-Suche (COM/ttyACM/ttyUSB)
- Benötigt PlatformIO für Entwicklung
- **Linux:** Möglicherweise Berechtigung erforderlich: `sudo chmod 666 /dev/ttyACM0`

### Datenbank
- SQLite-Datenbank: `db/nextgenlock.db`
- Setup-Skripte: `setupTables.sql`, `generateMockup.sql`
- Reset: `node db/resetDb.js`

### Dependencies
- Alle Dependencies werden automatisch durch die Starter-Skripte installiert
- Frontend benötigt Node.js 18+
- Backend benötigt Node.js 16+ und Build-Tools für better-sqlite3

