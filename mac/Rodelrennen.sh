#!/bin/bash

PORT=8000

# Prüfen, ob der Server auf Port 8000 läuft
if lsof -i :$PORT > /dev/null; then
    echo "Server läuft bereits auf Port $PORT."
    open -a "Google Chrome" http://localhost:$PORT
else
    echo "Starte den Server..."

    # Verzeichnis des Node.js-Servers
    cd /Users/jakob/Desktop/Programmieren/Projekte/Rodelrennen || { echo "Verzeichnis nicht gefunden!"; exit 1; }

    # Node.js-Server starten und Fehlerprotokolle schreiben
    /usr/local/bin/node server.js > server.log 2>&1 &

    # PID des Servers speichern (optional)
    SERVER_PID=$!
    echo "Server gestartet (PID: $SERVER_PID)."

    # Warten, bis der Server vollständig gestartet ist
    sleep 2

    # URL im Browser öffnen
    open -a "Google Chrome" http://localhost:$PORT
fi

# Skript sauber beenden
echo "Skript abgeschlossen."
exit 0
