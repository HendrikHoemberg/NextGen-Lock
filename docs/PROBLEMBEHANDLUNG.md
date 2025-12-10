# Problembehandlung

## Hardware-Probleme

### USB-Verbindung und Berechtigungen
- **Problem**: Verbindung von Arduino zu Computer fehlgeschlagen unter Linux
- **Ursache**: Fehlende Schreibrechte für USB-Port unter Linux
- **Lösung**: USB-Berechtigungen anpassen

### Widerstandsauswahl
- **Problem**: Anfängliche Startschwierigkeiten bei der Auswahl der passenden Widerstände
- **Lösung**: Korrekte Widerstandswerte durch Berechnung und Testing ermittelt

### OLED Display
- **Problem**: OLED Display konnte nicht implementiert werden
- **Ursache**: Mangels verbleibender Steckplätze am Arduino
- **Lösung**: Display wurde weggelassen, Funktionalität ohne Display realisiert

### Pin-Belegung
- **Problem**: Pin-Belegung war vertauscht
- **Lösung**: Korrekte Pin-Zuordnung in der Verkabelung und im Code vorgenommen

### LED-Steuerung
- **Problem**: LED-Farben stimmten nicht
- **Ursache**: LED_ON und LED_OFF als Variablen festgelegt, jedoch vertauscht (LED_ON = LOW, LED_OFF = HIGH)
- **Lösung**: Variablenwerte korrigiert 

## Architektur-Entscheidungen

### Mikrocontroller-Wechsel
- **Ursprüngliche Entscheidung**: ESP32 für WLAN-Funktionalität
- **Problem**: Komplexität und Zuverlässigkeitsprobleme
- **Finale Entscheidung**: Arduino Uno mit serieller Verbindung
- **Begründung**: Einfachere und zuverlässigere Kommunikation über serielle Schnittstelle
