#!/bin/zsh
# Verzeichnis des Node.js-Servers
cd /Users/jakob/Desktop/Programmieren/Projekte/Rodelrennen

# Node.js-Server starten
node server.js

# Warten, bis der Server gestartet ist
sleep 2

# Standardbrowser öffnen
open http://localhost:8000
