# NextGen Lock - RFID Access Control System

Full-stack RFID access control system with Arduino hardware integration, React frontend, and Express.js backend.

## Team: Die Grimmigen
- Julian Naumann
- Hendrik Hömberg

## Technology Stack

### Frontend
- **React 19** - UI Framework
- **Vite 7** - Build Tool & Dev Server
- **Tailwind CSS 4** - Styling with PostCSS
- **React Router DOM 7** - Navigation
- **Axios** - HTTP Client
- **date-fns 4** - Date Formatting
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

### Prerequisites

Before installing NextGen Lock, ensure you have **Node.js** installed on your system:
- **Node.js 16 or higher** is required for the backend
- **Node.js 18 or higher** is recommended for the frontend
- Download from [nodejs.org](https://nodejs.org/) or use your system's package manager

Verify your installation by running:
```bash
node --version
npm --version
```

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

## Features

### 1. Dashboard (`/`)
- Overview of all important statistics
- Number of users and RFID cards
- Last 5 access attempts with status
- Real-time updates

### 2. Access Logs (`/logs`)
- Complete list of all access attempts
- Filter by status (granted/denied)
- Search function by UID or note
- Timestamps and detailed information

### 3. User Management (`/users`)
- Create, edit, delete users
- Overview of assigned RFID cards
- Direct navigation to user cards
- Loading states and duplicate protection
- Confirm modal for security on delete operations

### 4. RFID Card Management (`/cards`)
- Create and manage cards
- Grant/revoke authorization with real-time feedback
- Assignment to users
- Filter by authorization status
- User name search filter
- URL-based filtering (`/cards?user=123`)
- Loading states for all actions
- Confirm modal for security on delete operations

### 5. Arduino Integration
- Automatic Arduino detection via SerialPort
- RFID card scan → Backend checks authorization
- **Blue LED** - Waiting for backend response
- **Green LED + 2s continuous tone** - Access granted
- **Red LED + 3x short beeps (250ms each)** - Access denied
- Automatic logging of all access attempts

## System Architecture

### Data Flow on RFID Scan:
1. Arduino reads RFID card
2. Sends UID via serial to backend
3. Backend checks database if card is authorized
4. Stores access attempt in access_log
5. Sends `GRANTED` or `DENIED` back to Arduino
6. Arduino displays corresponding LED/buzzer combination

### API Configuration

The frontend communicates with the backend via Vite proxy:

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

API services are structured in `frontend/src/services/api.js` with three main modules:
- `usersAPI` - User management
- `cardsAPI` - RFID card management
- `logsAPI` - Access logs

## Data Model (SQLite)

### Users
- `user_id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `first_name` - TEXT NOT NULL
- `last_name` - TEXT NOT NULL
- `created_at` - TEXT (datetime) DEFAULT now()

### RFID Cards
- `card_uid` - TEXT PRIMARY KEY (e.g., "A1 B2 C3 D4")
- `user_id` - INTEGER (Foreign Key → user.user_id, ON DELETE SET NULL)
- `authorized` - INTEGER (0/1) DEFAULT 0
- `added_on` - TEXT (datetime) DEFAULT now()

### Access Logs
- `log_id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `card_uid` - TEXT NOT NULL
- `access_time` - TEXT (datetime) DEFAULT now()
- `access_granted` - INTEGER (0/1) NOT NULL
- `note` - TEXT (e.g., "Card not registered", "Access granted")

**Note:** PRAGMA foreign_keys = ON is enabled

## Backend API Endpoints

### Users
- `GET /api/users` - All users (ORDER BY created_at DESC)
- `GET /api/users/:id` - Single user
- `POST /api/users` - Create user (body: first_name, last_name)
- `PUT /api/users/:id` - Update user (body: first_name, last_name)
- `DELETE /api/users/:id` - Delete user

### RFID Cards
- `GET /api/cards` - All cards with JOIN (c.*, u.first_name, u.last_name)
- `GET /api/cards/:cardId` - Single card with user info
- `GET /api/users/:userId/cards` - Cards of a user
- `POST /api/cards` - Create card (body: card_id, user_id?, authorized?)
- `PUT /api/cards/:cardId` - Update card (body: user_id, authorized)
- `DELETE /api/cards/:cardId` - Delete card
- `PATCH /api/cards/:cardId/authorize` - Authorize card
- `PATCH /api/cards/:cardId/revoke` - Revoke authorization
- `GET /api/cards/:cardId/verify` - Check authorization status (for testing)

### Access Logs
- `GET /api/logs` - All logs (Query: access_granted, limit, offset)
- `GET /api/logs/:id` - Single log
- `GET /api/logs/recent?limit=10` - Last n logs (ORDER BY access_time DESC)

### Arduino Serial Communication
Backend automatically listens for serial data from Arduino:
- **Format from Arduino:** `"USER ID tag : XX XX XX XX"` (e.g., "A1 B2 C3 D4")
- **Backend processing:**
  1. Extracts UID from serial message
  2. Converts to uppercase
  3. Searches card in database
  4. Checks `authorized` status
  5. Creates log entry in `access_log`
  6. Sends response back
- **Format to Arduino:** `GRANTED\n` or `DENIED\n`
- **Timeout:** Arduino waits max. 5 seconds for response

## Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```
Build files are created in the `frontend/dist/` folder.

**Preview production version:**
```bash
npm run preview
```

**Backend:**
```bash
cd backend
npm start      # Production mode (runs server.js directly)
npm run dev    # Development mode with nodemon (auto-restart on file changes)
```

## Project Structure

```
NextGen Lock/
├── arduino/
│   └── NextGenLock-Arduino/
│       ├── src/
│       │   └── main.cpp         # Arduino code with RFID & Serial
│       ├── platformio.ini       # PlatformIO configuration
│       ├── include/
│       ├── lib/
│       └── test/
├── backend/
│   ├── server.js                # Express server with SQLite & SerialPort
│   ├── package.json             # Backend dependencies
│   └── README.md
├── db/
│   ├── nextgenlock.db          # SQLite database (auto-generated)
│   ├── setupTables.sql         # Database schema (CREATE TABLE)
│   ├── generateMockup.sql      # Test data (INSERT statements)
│   └── resetDb.js              # Node.js script for DB setup
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Dashboard with statistics
│   │   │   ├── AccessLogs.jsx   # Access logs
│   │   │   ├── UsersPage.jsx    # User management
│   │   │   └── RFIDCards.jsx    # RFID card management
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx # Confirmation dialog for delete operations
│   │   │   └── Splashscreen.jsx # Loading/splash screen
│   │   ├── hooks/
│   │   │   └── useDarkMode.js   # Dark mode toggle hook
│   │   ├── services/
│   │   │   └── api.js           # Axios API client (usersAPI, cardsAPI, logsAPI)
│   │   ├── App.jsx              # React Router setup
│   │   ├── App.css              # App styles
│   │   ├── index.css            # Global styles + Tailwind
│   │   └── main.jsx             # Entry point
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite with API proxy
│   ├── tailwind.config.js       # Tailwind CSS 4 config
│   ├── postcss.config.js        # PostCSS config
│   ├── package.json             # Frontend dependencies
│   └── public/
│       └── images/              # Static images
├── start-servers.bat            # Windows batch starter
├── start-servers.ps1            # Windows PowerShell starter
├── start-servers.sh             # Linux bash starter
└── README.md                    # This file

```

## Arduino Hardware Setup

### Components
- Arduino board (Uno, Nano, etc.)
- MFRC522 RFID reader
- RGB LED (or 3 separate LEDs)
  - Pin 5: Red (Access Denied)
  - Pin 6: Green (Access Granted)
  - Pin 7: Blue (RFID Detected)
- Buzzer at Pin 2
- MFRC522 pins:
  - SS: Pin 10
  - RST: Pin 9
  - SPI: Standard Arduino SPI pins

### PlatformIO Configuration

The Arduino project uses PlatformIO for development. Configuration is in `platformio.ini`:

```ini
[env:uno]
platform = atmelavr
board = uno
framework = arduino
lib_deps = miguelbalboa/MFRC522@^1.4.12
```

### Libraries
- **MFRC522** - RFID reader library for SPI communication with MFRC522 module

### LED State Machine
Arduino uses a `ledState` enum with 4 states:
- **IDLE** - All LEDs off, waiting for RFID card
- **RFID_DETECTED** - Blue LED on, waiting for backend response
- **ACCESS_GRANTED** - Green LED on + buzzer 2s continuous tone
- **ACCESS_DENIED** - Red LED on + buzzer 3x 250ms beeps (total 1.5s)

### Buzzer Patterns
- **Access granted:** 2 seconds continuous tone
- **Access denied:** 3 short beeps (250ms tone + 250ms pause each)

### Wiring
```
MFRC522    -> Arduino
SDA (SS)   -> Pin 10 (SS_PIN)
RST        -> Pin 9 (RST_PIN)
SCK        -> Pin 13 (Standard SPI)
MOSI       -> Pin 11 (Standard SPI)
MISO       -> Pin 12 (Standard SPI)
3.3V       -> 3.3V
GND        -> GND

LED Red    -> Pin 5 (LED_R_PIN, with 220Ω resistor)
LED Green  -> Pin 6 (LED_G_PIN, with 220Ω resistor)
LED Blue   -> Pin 7 (LED_B_PIN, with 220Ω resistor)
Buzzer     -> Pin 2 (BUZZER)
```

## Notes & Troubleshooting

### Ports
- Backend runs on port **5000**
- Frontend dev server on port **3000**
- Arduino communicates via SerialPort (9600 baud)

### Arduino
- Automatically detected via SerialPort search (COM/ttyACM/ttyUSB)
- Requires PlatformIO for development
- **Linux:** May require permission: `sudo chmod 666 /dev/ttyACM0`

### Database
- SQLite database: `db/nextgenlock.db`
- Setup scripts: `setupTables.sql`, `generateMockup.sql`
- Reset: `node db/resetDb.js`

### Dependencies
- All dependencies are automatically installed by the starter scripts
- Frontend requires Node.js 18+
- Backend requires Node.js 16+ and build tools for better-sqlite3

