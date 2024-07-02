

// const buttonAddGroup = document.getElementById("buttonAddGroup");

// buttonAddGroup.addEventListener("click", (event) => {
//     event.preventDefault(); // Verhindert die Standardaktion des Ereignisses (in diesem Fall das Neuladen der Seite)
//     createGroupTable();
// });

// function createGroupTable() {

//     // Formulareingaben abrufen
//     const groupNameInput = document.getElementById("groupname").value;
//     const groupAge1Input = document.getElementById("age1").value;
//     const groupAge2Input = document.getElementById("age2").value;
//     const groupGenderInput = document.getElementById("groupgender").value;

//     // Überprüfen, ob alle Eingabefelder ausgefüllt sind
//     if (groupNameInput === "" || groupAge1Input === "" || groupAge2Input === "" || groupGenderInput === "") {
//         alert("Bitte füllen Sie alle Felder der Gruppen Auswertung aus.");
//         return;
//     }

//     // Originaltabelle und Zieldokument für die neue Tabelle abrufen
//     const originalTable = document.getElementById("membertable");
//     const originalTableHead = document.getElementById("membertableHead");
//     const newTableBody = document.createElement("tbody");

//     // Durch jede Zeile der Originaltabelle iterieren
//     let hasParticipants = false; // Variable, um zu überprüfen, ob Teilnehmer gefunden wurden
//     for (let i = 1; i < originalTable.rows.length; i++) { // Beginne bei 1, um den Header zu überspringen
//         const row = originalTable.rows[i];
//         const rowData = {
//             fname: row.cells[0].innerText,
//             sname: row.cells[1].innerText,
//             birthyear: parseInt(row.cells[2].innerText),
//             gender: row.cells[3].innerText
//         };

//         // Überprüfen, ob die Zeile den Kriterien entspricht
//         if ((rowData.birthyear >= parseInt(groupAge1Input)) && (rowData.birthyear <= parseInt(groupAge2Input)) && rowData.gender === groupGenderInput) {
//             hasParticipants = true; // Teilnehmer gefunden
//             const newRow = newTableBody.insertRow();
//             for (const [key, value] of Object.entries(rowData)) {
//                 const cell = newRow.insertCell();
//                 cell.innerText = value;
//             }
//         }
//     }

//     // Überprüfen, ob Teilnehmer gefunden wurden
//     if (hasParticipants) {
//         // Neue Tabelle erstellen und anzeigen
//         const newTable = document.createElement("table");
//         newTable.appendChild(originalTableHead.cloneNode(true)); // Kopiere den Tabellenkopf
//         newTable.appendChild(newTableBody);

//         // Überschrift erstellen
//         const heading = document.createElement("h2");
//         heading.textContent = groupNameInput;

//         const groupTableDiv = document.getElementById("grouptables");
//         groupTableDiv.appendChild(heading);
//         groupTableDiv.appendChild(newTable); // Füge die neue Tabelle dem Div-Element hinzu

//     } else {
//         alert("Es sind keine Teilnehmer die den Kategorien entsprechen angemeldet");
//     }
// }


////////////////////////////////////////////////////////////////////
// New Code Main.js
////////////////////////////////////////////////////////////////////

//******************************************************************
// add member to membertable
//******************************************************************
document.addEventListener("DOMContentLoaded", () => {

    const buttonAdd = document.getElementById("buttonAdd");
    buttonAdd.addEventListener("click", (event) => {
        event.preventDefault(); // Verhindert die Standardaktion des Ereignisses (in diesem Fall das Neuladen der Seite)
        createTable();
    });
});

async function createTable() {

    const form = document.getElementById("memberForm");

    const formData = new FormData(form);
    const jsonData = {};
    
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    // Formulareingaben abrufen
    const fnameInput = jsonData.fname;
    const snameInput = jsonData.sname;
    const birthyearInput = jsonData.birthyear;
    const genderInput = jsonData.gender;

    // Regulärer Ausdruck für Buchstaben (nur Groß- und Kleinbuchstaben)
    const lettersOnlyRegex = /^[a-zA-Z\s\-]+$/;
    // Regulärer Ausdruck für eine vierstellige Jahreszahl
    const yearRegex = /^\d{4}$/;
    // Aktuelles Jahr ermitteln
    const currentYear = new Date().getFullYear();

    // Überprüfen, ob alle Eingabefelder ausgefüllt sind
    if (fnameInput === "" || snameInput === "" || birthyearInput === "" || genderInput === "") {
        alert("Bitte füllen Sie alle Felder aus.");
        return; // Die Funktion wird beendet, wenn nicht alle Felder ausgefüllt sind
    } else if ( ( !lettersOnlyRegex.test(fnameInput) ) || ( !lettersOnlyRegex.test(snameInput) ) ) {
        alert("Bitte für den Namen nur Buchstaben verwenden.");
        return;
    } else if ( !(yearRegex.test(birthyearInput) && parseInt(birthyearInput) <= currentYear) ) {
        alert("Bitte eine gültige Jahreszahl eingeben.");
        return;
    }

    try {
        const response = await fetch('/process-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Erfolgreich hinzugefügt:", data);

            // Container-Element selektieren
            const table = document.getElementById('membertable');

            // Tabellenkörper erstellen
            const tbody = document.createElement('tbody');
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>
                ${data.fname}
            </td>
            <td>
                ${data.sname}
            </td>
            <td>
                ${data.birthyear}
            </td>
            <td>
                ${data.gender}
            </td>
            `;    
            tbody.appendChild(tr);

            // Tabellenkörper zu Tabelle hinzufügen
            table.appendChild(tbody);

            // Formularfelder leeren
            document.getElementById("fname").value = "";
            document.getElementById("sname").value = "";
            document.getElementById("birthyear").value = "";
            document.getElementById("gender").value = "default";

        } else {
            console.error("Fehler beim Hinzufügen:", response.statusText);
        }
    } 
    catch (error) {
        console.error("Fehler:", error);
    }
}; 

//******************************************************************
// select member and delete member from membertable
//******************************************************************
// Selektierte Zeile als globale Variable speichern
var selectedRow = null;

document.getElementById("membertable").addEventListener("click", function(event) {
    var clickedRow = event.target.parentNode; // Das TR-Element der angeklickten Zelle abrufen
    if (clickedRow.tagName === "TR") {
        if (selectedRow) {
            // Wenn bereits eine Zeile ausgewählt wurde, die Markierung entfernen
            selectedRow.classList.remove("selected");
        }
        // Aktuelle Zeile als ausgewählt markieren
        selectedRow = clickedRow;
        selectedRow.classList.add("selected");
    }
});

const buttonDelete = document.getElementById("buttonDelete");
buttonDelete.addEventListener("click", (event) => {
    event.preventDefault(); // Verhindert die Standardaktion des Ereignisses (in diesem Fall das Neuladen der Seite)
    deleteSelectedRow();
});

function deleteSelectedRow() {
    if (selectedRow) {

        

        selectedRow.remove(); // Die ausgewählte Zeile entfernen
        selectedRow = null; // Die Auswahl zurücksetzen
    } else {
        alert("Es wurde keine Zeile ausgewählt.");
    }
}