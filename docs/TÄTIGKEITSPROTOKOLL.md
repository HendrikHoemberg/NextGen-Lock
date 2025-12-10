# Tätigkeitsprotokoll - NextGen Lock

## Projektplanung und Konzeption

**Julian Naumann & Hendrik Hömberg:**
- Anforderungsanalyse und Definition des Projektumfangs durchgeführt
- Recherche zu RFID-Technologie und geeigneten Hardware-Komponenten

**Julian Naumann:**
- Erstellung des ersten Architekturkonzepts mit ESP32-Integration

**Hendrik Hömberg:**
- Evaluation verschiedener Mikrocontroller-Plattformen (ESP32 vs. Arduino Uno)
- Konzeption der Datenbankstruktur und ER-Diagramm erstellt

**Julian Naumann & Hendrik Hömberg:**
- Planung der Systemschnittstellen und Kommunikationsprotokolle

## Hardware Setup

**Julian Naumann & Hendrik Hömberg:**
- Erste Verkabelung und Breadboard-Aufbau nach Datenblättern
- Überprüfung der Pin-Belegungen und Kompatibilität der Komponenten

**Julian Naumann:**
- Berechnung und Auswahl der benötigten Widerstände

**Hendrik Hömberg:**
- Test der RFID-Modul-Funktionalität mit Beispielcode
- Dokumentation der Hardware-Spezifikationen und Pin-Zuordnungen

## Arduino-Entwicklung

**Hendrik Hömberg:**
- Einrichtung der Entwicklungsumgebung (PlatformIO) und Installation der MFRC522-Bibliothek
- Implementierung der RFID-Kartenlesung über SPI-Protokoll
- Programmierung der seriellen Kommunikation (9600 Baud) für Arduino-Backend-Verbindung

**Julian Naumann:**
- Implementierung der RGB-LED-Steuerung für visuelle Statusanzeigen
- Programmierung des Buzzer-Feedbacks (akustische Signale für Zugang gewährt/verweigert)
- Debugging und Korrektur der LED_ON/LED_OFF-Logik (HIGH/LOW-Invertierung)

## Backend-Entwicklung

**Julian Naumann:**
- Aufsetzen des Express.js-Servers mit Node.js
- Implementierung der SQLite-Datenbankanbindung mit better-sqlite3
- Entwicklung der REST-API-Endpunkte für Benutzer- und Kartenverwaltung

**Hendrik Hömberg:**
- Implementierung der SerialPort-Kommunikation für Arduino-Integration
- Entwicklung der Authentifizierungslogik und Datenbankabfragen
- Implementierung des Access-Log-Systems mit Zeitstempeln

## Datenbank-Design und -Implementierung

**Hendrik Hömberg:**
- Erstellung der SQL-Schema-Definitionen (setupTables.sql)
- Implementierung der Tabellen: users, rfid_cards, access_logs
- Entwicklung des Datenbank-Reset-Scripts (resetDb.js)

**Julian Naumann:**
- Erstellung der Mock-Daten für Testzwecke (generateMockup.sql)
- Implementierung von Constraints und Fremdschlüssel-Beziehungen
- Optimierung der Datenbankabfragen für schnelle Zugriffsprüfung

## Frontend-Entwicklung

**Julian Naumann:**
- Aufsetzen des React-Projekts mit Vite als Build-Tool
- Konfiguration von Tailwind CSS für responsives Design
- Implementierung des React-Routers für Multi-Page-Navigation

**Hendrik Hömberg:**
- Entwicklung der Dashboard-Komponente mit Übersichtsstatistiken
- Implementierung der Benutzerverwaltungs-Seite (UsersPage.jsx)
- Entwicklung der RFID-Kartenverwaltung (RFIDCards.jsx)

**Julian Naumann:**
- Implementierung der Access-Logs-Anzeige mit Filteroptionen
- Entwicklung wiederverwendbarer UI-Komponenten (ConfirmModal, Splashscreen)
- Integration des Dark-Mode-Features mit Custom Hook

**Hendrik Hömberg:**
- Implementierung der API-Service-Layer (api.js) mit Axios
- Entwicklung der CRUD-Operationen für alle Entitäten
- Styling und Responsive Design mit Tailwind CSS

## System-Integration und Testing

**Julian Naumann & Hendrik Hömberg:**
- Integration aller Systemkomponenten (Arduino, Backend, Frontend)
- End-to-End-Tests der Zugriffskontroll-Funktionalität
- Durchführung von Hardware-Tests mit verschiedenen RFID-Karten

**Hendrik Hömberg:**
- Debugging der seriellen Kommunikation zwischen Arduino und Backend

**Julian Naumann:**
- Validierung der LED- und Buzzer-Feedback-Mechanismen
- Performance-Tests der Datenbank-Abfragen

## Problembehandlung und Optimierung

**Julian Naumann & Hendrik Hömberg:**
- Migration von ESP32 auf Arduino Uno für stabilere Kommunikation
- Anpassung der Architektur für serielle statt WLAN-Verbindung
- Korrektur der vertauschten Pin-Belegungen

**Julian Naumann:**
- Lösung der USB-Berechtigungsprobleme unter Linux
- Behebung der LED-Farb-Steuerungsprobleme

**Hendrik Hömberg:**
- Entscheidung gegen OLED-Display aufgrund von Pin-Limitierungen

## Deployment und Automatisierung

**Julian Naumann & Hendrik Hömberg:**
- Entwicklung der plattformübergreifenden Startup-Scripts
- Implementierung der automatischen Abhängigkeitsinstallation

**Hendrik Hömberg:**
- Erstellung von start-servers.ps1 für Windows PowerShell
- Erstellung von start-servers.sh für macOS/Linux

**Julian Naumann:**
- Entwicklung von start-servers.bat für Windows Command Prompt
- Konfiguration der automatischen Browser-Öffnung beim Start

## Dokumentation

**Julian Naumann:**
- Erstellung der README.md mit Installationsanleitung
- Dokumentation der Hardware-Spezifikationen und Pin-Belegungen
- Verfassen der Softwarekomponenten-Übersicht

**Hendrik Hömberg:**
- Erstellung der ausführlichen TESTANLEITUNG.md
- Dokumentation aller Problemlösungen (PROBLEMBEHANDLUNG.md)
- Erstellung der Architektur-Diagramme (NextGenLock-Architektur.drawio)

**Julian Naumann:**
- Erstellung des ER-Diagramms für die Datenbankstruktur
- Verfassen der Bedienungsanweisung mit Schritt-für-Schritt-Anleitungen
- Dokumentation der REST-API-Endpunkte

**Hendrik Hömberg:**
- Erstellung der Projektdokumentation mit vollständiger Projektbeschreibung
- Verfassen des Fazits mit Reflexion und Ausblick
- Finalisierung aller Dokumentationsdateien
