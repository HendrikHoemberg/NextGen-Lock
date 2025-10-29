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
- Anzahl Benutzer, RFID-Karten, Zugriffe
- Letzte Zugangsversuche
- Erfolgsrate

### 2. Zugriffsprotokolle (`/logs`)
- Vollständige Liste aller Zugangsversuche
- Filter nach Status (gewährt/verweigert)
- Suchfunktion nach UID

### 3. Benutzer-Verwaltung (`/users`)
- Benutzer anlegen, bearbeiten, löschen
- Übersicht der zugeordneten RFID-Karten
- Registrierungsdatum

### 4. RFID-Karten-Verwaltung (`/cards`)
- Karten anlegen und verwalten
- Autorisierung erteilen/widerrufen
- Zuordnung zu Benutzern
- Filter nach Autorisierungsstatus

## API-Konfiguration

Die Frontend-Anwendung kommuniziert mit dem Backend über `/api`. In der `vite.config.js` ist ein Proxy konfiguriert:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

Passe die Backend-URL bei Bedarf an.

## Datenmodell

### Users (Benutzer)
- `user_id` - Eindeutige ID
- `first_name` - Vorname
- `last_name` - Nachname
- `created_at` - Registrierungszeitpunkt

### RFID Cards (RFID-Karten)
- `card_id` - Eindeutige ID
- `uid` - RFID-Chip UID
- `user_id` - Zugeordneter Benutzer
- `authorized` - Autorisierungsstatus
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
- `GET /api/cards` - Alle Karten
- `GET /api/cards/:id` - Einzelne Karte
- `GET /api/users/:userId/cards` - Karten eines Benutzers
- `POST /api/cards` - Karte erstellen
- `PUT /api/cards/:id` - Karte aktualisieren
- `DELETE /api/cards/:id` - Karte löschen
- `PATCH /api/cards/:id/authorize` - Karte autorisieren
- `PATCH /api/cards/:id/revoke` - Autorisierung widerrufen

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

## Struktur

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx        # Dashboard-Übersicht (/)
│   │   ├── AccessLogs.jsx       # Zugriffsprotokolle (/logs)
│   │   ├── UsersPage.jsx        # Benutzerverwaltung (/users)
│   │   └── RFIDCards.jsx        # RFID-Kartenverwaltung (/cards)
│   ├── services/
│   │   ├── api.js               # API-Aufrufe
│   │   └── dummyData.js         # Dummy-Daten für Tests
│   ├── App.jsx                  # Hauptkomponente mit Router
│   ├── App.css                  # Zusätzliche Styles
│   ├── main.jsx                 # Entry Point
│   └── index.css                # Tailwind & Globals
├── index.html                   # HTML-Template
├── vite.config.js               # Vite-Konfiguration
├── tailwind.config.js           # Tailwind-Konfiguration
├── postcss.config.js            # PostCSS-Konfiguration
└── package.json                 # Dependencies

```

## Entwicklung

### Dummy-Daten für lokale Tests
Die Anwendung kann ohne Backend mit Dummy-Daten getestet werden. Diese sind in `services/dummyData.js` definiert und können in den API-Aufrufen verwendet werden.

### Fehlerbehandlung
Die Anwendung zeigt Fehler-Toast-Meldungen bei fehlerhaften API-Aufrufen. Überprüfen Sie die Browser-Konsole für detaillierte Fehlermeldungen.

## Hinweise

- Die Anwendung erwartet, dass das Backend auf Port 5000 läuft
- Der Dev-Server läuft auf Port 3000 (via Vite)
- Die Anwendung nutzt Dummy-Daten aus `services/dummyData.js` für Tests
- API-Proxy ist in `vite.config.js` konfiguriert
