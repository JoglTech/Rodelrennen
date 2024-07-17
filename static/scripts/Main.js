

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
// load correct page from link
//******************************************************************
document.addEventListener('DOMContentLoaded', function() {
    // Finde alle Links mit der Klasse "mdl-navigation__link"
    const links = document.querySelectorAll('.mdl-navigation__link');

    if (links.length === 0) {
        console.error('Keine Links mit der Klasse "mdl-navigation__link" gefunden.');
        return;
    }

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Verhindert das Standardverhalten des Links

            // Die URL, die geladen werden soll
            const url = this.href;

            // Fetch API verwenden, um den Inhalt zu laden
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Netzwerk-Antwort war nicht ok');
                    }
                    return response.text();
                })
                .then(data => {
                    const contentDiv = document.getElementById('page-content');
                    if (!contentDiv) {
                        throw new Error('Element mit der ID "page-content" wurde nicht gefunden.');
                    }
                    // Den neuen Inhalt in das DIV mit der ID "page-content" einfügen
                    contentDiv.innerHTML = data;

                    const pageContent = document.getElementById('page');
                    if (!pageContent) {
                        console.error('Element mit der ID "page" wurde nicht gefunden.');
                        return;
                    }

                    const pageType = pageContent.getAttribute('data-page-type');
                    
                    // Hier können Sie den Typ der Seite überprüfen und entsprechenden Code ausführen
                    if (pageType === 'gruppenverwaltung') 
                    {
                        console.log('Gruppenverwaltung Seite ist geladen.');
                        // Fügen Sie hier spezifische Logik für die Gruppenverwaltung-Seite hinzu
                        groupManagement();
                    } 
                    else if (pageType === 'teilnehmerbearbeitung') 
                    {
                        console.log('Teilnehmerbearbeitung Seite ist geladen.');
                        // Fügen Sie hier spezifische Logik für die Teilnehmerbearbeitung-Seite hinzu
                        participantProcessing();
                    } 
                    else if (pageType === 'zeiterfassung') 
                    {
                        console.log('Zeiterfassung Seite ist geladen.');
                        // Fügen Sie hier spezifische Logik für die Zeiterfassung-Seite hinzu
                    } 
                    else if (pageType === 'ergebnisliste') 
                    {
                        console.log('Ergebnisliste Seite ist geladen.');
                        // Fügen Sie hier spezifische Logik für die Ergebnisliste-Seite hinzu
                    } 
                    else 
                    {
                        console.log('Unbekannte Seite ist geladen.');
                        // Fügen Sie hier eine Standardaktion für unbekannte Seiten hinzu, falls benötigt
                    }
                })
                .catch(error => {
                    console.error('Es gab ein Problem mit der Fetch-Operation:', error);
                });
        });
    });
});


//******************************************************************
// page specific scripts
//******************************************************************

//participant processing
function participantProcessing() {

    //******************************************************************
    // add member to membertable
    //******************************************************************
    const buttonAdd = document.getElementById("buttonAdd");
    if (!buttonAdd) {
        console.error('Element mit der ID "buttonAdd" wurde nicht gefunden.');
        return;
    }

    buttonAdd.addEventListener("click", (event) => {
        event.preventDefault(); // Verhindert die Standardaktion des Ereignisses (in diesem Fall das Neuladen der Seite)
        createMemberTable();
    });

    //******************************************************************
    // select member and delete member from membertable
    //******************************************************************

    // Selektierte Zeile als globale Variable speichern
    var selectedRow = null;

    const membertable = document.getElementById("membertable");
    if (membertable) {
        membertable.addEventListener("click", function (event) {
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
    } else {
        console.error('Element mit der ID "membertable" wurde nicht gefunden.');
    }

    const buttonDelete = document.getElementById("buttonDelete");
    if (buttonDelete) {
        buttonDelete.addEventListener("click", (event) => {
            event.preventDefault(); // Verhindert die Standardaktion des Ereignisses (in diesem Fall das Neuladen der Seite)
            deleteSelectedRow(selectedRow);
        });
    } else {
        console.error('Element mit der ID "buttonDelete" wurde nicht gefunden.');
    }
}

async function createMemberTable() {
    const form = document.getElementById("memberForm");
    if (!form) {
        console.error('Element mit der ID "memberForm" wurde nicht gefunden.');
        return;
    }

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
    } else if ((!lettersOnlyRegex.test(fnameInput)) || (!lettersOnlyRegex.test(snameInput))) {
        alert("Bitte für den Namen nur Buchstaben verwenden.");
        return;
    } else if (!(yearRegex.test(birthyearInput) && parseInt(birthyearInput) <= currentYear)) {
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
            if (!table) {
                throw new Error('Element mit der ID "membertable" wurde nicht gefunden.');
            }

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
    } catch (error) {
        console.error("Fehler:", error);
    }
};

function deleteSelectedRow(selectedRow) {
    if (selectedRow) {
        selectedRow.remove(); // Die ausgewählte Zeile entfernen
        selectedRow = null; // Die Auswahl zurücksetzen
    } else {
        alert("Es wurde keine Zeile ausgewählt.");
    }
}

// group management

let displayedGroupIds = [];

async function groupManagement() {

    displayedGroupIds = [];
    //******************************************************************
    // show existing grouptables
    //******************************************************************
    try {
        const response = await fetch('/groups');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const groups = await response.json();
        displayGroups(groups);
    } 
    catch (error) {
        console.error('Error fetching data:', error);
    }

    //******************************************************************
    // add group to grouptable
    //******************************************************************
    const buttonAdd = document.getElementById("buttonAddGroup");
    if (!buttonAdd) {
        console.error('Element mit der ID "buttonAddGroup" wurde nicht gefunden.');
        return;
    }

    buttonAdd.addEventListener("click", (event) => {
        event.preventDefault(); // Verhindert die Standardaktion des Ereignisses (in diesem Fall das Neuladen der Seite)
        createGroupTable();
    });

    //******************************************************************
    // select group and delete group from grouptable
    //******************************************************************

    // Selektierte Zeile als globale Variable speichern
    var selectedGroupRow = null;

    const grouptable = document.getElementById("grouptable");
    if (grouptable) {
        grouptable.addEventListener("click", function (event) {
            var clickedGroupRow = event.target.parentNode; // Das TR-Element der angeklickten Zelle abrufen
            if ( (clickedGroupRow.tagName === "TR") && !(event.target.tagName === "TH") ) {
                if (selectedGroupRow) {
                    // Wenn bereits eine Zeile ausgewählt wurde, die Markierung entfernen
                    selectedGroupRow.classList.remove("selected");
                }
                // Aktuelle Zeile als ausgewählt markieren
                selectedGroupRow = clickedGroupRow;
                selectedGroupRow.classList.add("selected");
            }
        });
    } else {
        console.error('Element mit der ID "grouptable" wurde nicht gefunden.');
    }

    const buttonDeleteGroup = document.getElementById("buttonDeleteGroup");
    if (buttonDeleteGroup) {
        buttonDeleteGroup.addEventListener("click", (event) => {
            event.preventDefault(); // Verhindert die Standardaktion des Ereignisses (in diesem Fall das Neuladen der Seite)
            deleteSelectedGroupRow(selectedGroupRow);
        });
    } else {
        console.error('Element mit der ID "buttonDeleteGroup" wurde nicht gefunden.');
    }
}

async function createGroupTable() {
    const form = document.getElementById("groupForm");
    if (!form) {
        console.error('Element mit der ID "groupForm" wurde nicht gefunden.');
        return;
    }

    const formData = new FormData(form);
    const jsonData = {};

    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    // Formulareingaben abrufen
    const nameInput = jsonData.name;
    const startYearInput = jsonData.startYear;
    const endYearInput = jsonData.endYear;
    const genderInput = jsonData.gender;
    const bodingerInput = jsonData.bodinger;

    // Regulärer Ausdruck für eine vierstellige Jahreszahl
    const yearRegex = /^\d{4}$/;
    // Aktuelles Jahr ermitteln
    const currentYear = new Date().getFullYear();

    // Überprüfen, ob alle Eingabefelder ausgefüllt sind
    if (nameInput === "" || startYearInput === "" || endYearInput === "" || genderInput === "" || bodingerInput === "") {
        alert("Bitte füllen Sie alle Felder aus.");
        return; // Die Funktion wird beendet, wenn nicht alle Felder ausgefüllt sind
    } else if (!(yearRegex.test(startYearInput) && parseInt(startYearInput) <= currentYear)) {
        alert("Bitte eine gültige Jahreszahl für das Startjahr eingeben.");
        return;
    } else if (!(yearRegex.test(endYearInput) && parseInt(endYearInput) <= currentYear)) {
        alert("Bitte eine gültige Jahreszahl für das Endjahr eingeben.");
        return;
    } else if (parseInt(startYearInput) > parseInt(endYearInput)) {
        alert("Das Startjahr muss kleiner als das Endjahr sein.");
        return;
    }

    try {
        const response = await fetch('/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            //******************************************************************
            // show existing grouptables
            //******************************************************************

            try {
                const response = await fetch('/groups');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const groups = await response.json();
                displayGroups(groups);
            } 
            catch (error) {
                console.error('Error fetching data:', error);
            }

            // Formularfelder leeren
            document.getElementById("name").value = "";
            document.getElementById("startYear").value = "";
            document.getElementById("endYear").value = "";
            document.getElementById("gender").value = "default";
            document.getElementById("bodinger").checked = false;

        } else {
            console.error("Fehler beim Hinzufügen:", response.statusText);
        }
    } catch (error) {
        console.error("Fehler:", error);
    }
};

function displayGroups(groups) {
    const table = document.getElementById('grouptable');
    if (!table) {
        throw new Error('Element mit der ID "grouptable" wurde nicht gefunden.');
    }

    groups.forEach(group => {
        // Überprüfen, ob die Gruppe bereits angezeigt wird
        if (displayedGroupIds.includes(group.id)) {
            return; // Bereits angezeigte Gruppe überspringen
        }

        // Tabellenkörper erstellen
        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        let dataBodinger = group.bodinger == "1" ? "Ja" : "Nein";

        tr.innerHTML = `
        <td>${group.id}</td>
        <td>${group.name}</td>
        <td>${group.startYear}</td>
        <td>${group.endYear}</td>
        <td>${group.gender}</td>
        <td>${dataBodinger}</td>
        `;
        tbody.appendChild(tr);

        // Tabellenkörper zu Tabelle hinzufügen
        table.appendChild(tbody);

        // ID zur Liste der angezeigten Gruppen hinzufügen
        displayedGroupIds.push(group.id);
    });
}

async function deleteSelectedGroupRow(selectedGroupRow) {
    if (selectedGroupRow) {

        const groupId = selectedGroupRow.firstElementChild.textContent;
        console.log("Deleting group with ID:", groupId);

        if (groupId) {
            try {
                const response = await fetch(`/groups/${groupId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    selectedGroupRow.remove(); // Die ausgewählte Zeile entfernen
                } else {
                    alert('Failed to delete the group.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the group.');
            }
        } else {
            alert('No group ID provided.');
        }
        selectedGroupRow = null; // Die Auswahl zurücksetzen
    } else {
        alert("Es wurde keine Zeile ausgewählt.");
    }
}
