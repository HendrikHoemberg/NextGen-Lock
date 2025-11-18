# NextGen Lock Backend

Node.js/Express Backend Server für das RFID-Zugangssystem.

## Technologien

- **Express** - Web Framework
- **better-sqlite3** - SQLite Datenbank (synchron, schnell, keine deprecated dependencies)
- **SerialPort** - Arduino Kommunikation
- **CORS** - Cross-Origin Resource Sharing

## Installation

```bash
npm install
```

## Starten

```bash
npm start
```

Server läuft auf `http://localhost:5000`

## Features

### REST API Endpoints

#### Users
- `GET /api/users` - Alle Benutzer
- `GET /api/users/:id` - Einzelner Benutzer
- `POST /api/users` - Benutzer erstellen (body: first_name, last_name)
- `PUT /api/users/:id` - Benutzer aktualisieren
- `DELETE /api/users/:id` - Benutzer löschen

#### RFID Cards
- `GET /api/cards` - Alle Karten mit User-Daten
- `GET /api/cards/:cardId` - Einzelne Karte
- `GET /api/users/:userId/cards` - Alle Karten eines Users
- `POST /api/cards` - Karte erstellen (body: card_id, user_id, authorized)
- `PUT /api/cards/:cardId` - Karte aktualisieren
- `DELETE /api/cards/:cardId` - Karte löschen
- `PATCH /api/cards/:cardId/authorize` - Autorisierung erteilen
- `PATCH /api/cards/:cardId/revoke` - Autorisierung widerrufen
- `GET /api/cards/:cardId/verify` - Autorisierungsstatus prüfen

#### Access Logs
- `GET /api/logs` - Alle Logs (optional: ?access_granted=1&limit=10&offset=0)
- `GET /api/logs/:id` - Einzelner Log
- `GET /api/logs/recent?limit=10` - Letzte n Logs

### SerialPort Integration

Der Server erkennt automatisch das Arduino über SerialPort (COM/ttyACM/ttyUSB).

**Datenfluss:**
1. Arduino sendet: `USER ID tag : A1 B2 C3 D4`
2. Backend prüft Autorisierung in Datenbank
3. Backend loggt Zugriffsversuch in `access_log`
4. Backend antwortet: `GRANTED` oder `DENIED`

### Datenbank

SQLite Datenbank in `../db/nextgenlock.db`

**Schema:**
- `user` - Benutzer mit first_name, last_name
- `rfid_card` - Karten mit card_id (UID), user_id, authorized
- `access_log` - Zugriffsprotokolle mit card_uid, access_granted, note

### Code-Style

- Beschreibende Variablennamen (`request`, `response`, `error`)
- Synchrone better-sqlite3 API
- Try-catch Fehlerbehandlung
- Prepared Statements für SQL-Queries

## Development

Automatische Installation und Start über Root-Skripte:
- `start-servers.bat` (Windows)
- `start-servers.ps1` (PowerShell)
- `start-servers.sh` (Linux)
