#!/bin/bash

# Verzeichnis des Node.js-Servers
cd /Users/jakob/Desktop/Programmieren/Projekte/Rodelrennen

# Node.js-Server starten und Fehlerprotokolle schreiben
/usr/local/bin/node server.js

# Warten, bis der Server vollständig gestartet ist (anpassen, falls notwendig)
sleep 2

open http://localhost:8000
