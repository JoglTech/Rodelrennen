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
                        timeRecording();
                    } 
                    else if (pageType === 'ergebnisliste') 
                    {
                        console.log('Ergebnisliste Seite ist geladen.');
                        // Fügen Sie hier spezifische Logik für die Ergebnisliste-Seite hinzu
                        resultList();
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

// participant processing
let displayedMemberStartNbrs = [];

async function participantProcessing() {

    displayedMemberStartNbrs = [];
    //******************************************************************
    // show existing membertables
    //******************************************************************
    try {
        const response = await fetch('/members');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const members = await response.json();
        displayMembers(members);
    } 
    catch (error) {
        console.error('Error fetching data:', error);
    }

    //******************************************************************
    // add member to membertable
    //******************************************************************
    const buttonAdd = document.getElementById("buttonAddMember");
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
    var selectedMemberRow = null;

    const membertable = document.getElementById("membertable");
    if (membertable) {
        membertable.addEventListener("click", function (event) {
            var clickedMemberRow = event.target.parentNode; // Das TR-Element der angeklickten Zelle abrufen
            if ( (clickedMemberRow.tagName === "TR") && !(event.target.tagName === "TH") ) {
                if (selectedMemberRow) {
                    // Wenn bereits eine Zeile ausgewählt wurde, die Markierung entfernen
                    selectedMemberRow.classList.remove("selected");
                }
                // Aktuelle Zeile als ausgewählt markieren
                selectedMemberRow = clickedMemberRow;
                selectedMemberRow.classList.add("selected");
            }
        });
    } else {
        console.error('Element mit der ID "membertable" wurde nicht gefunden.');
    }

    const buttonDelete = document.getElementById("buttonDeleteMember");
    if (buttonDelete) {
        buttonDelete.addEventListener("click", (event) => {
            event.preventDefault(); // Verhindert die Standardaktion des Ereignisses (in diesem Fall das Neuladen der Seite)
            deleteSelectedMemberRow(selectedMemberRow);
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
    const startnbrInput = jsonData.startnbr;
    const firstnameInput = jsonData.firstname;
    const lastnameInput = jsonData.lastname;
    const clubInput = jsonData.club;
    const birthyearInput = jsonData.birthyear;
    const genderInput = jsonData.gender;
    const bodingerInput = jsonData.bodinger;
    const cupmemberInput = jsonData.cupmember;

    // Regulärer Ausdruck für Buchstaben (nur Groß- und Kleinbuchstaben)
    const lettersOnlyRegex = /^[a-zA-Z\s\-]+$/;
    // Regulärer Ausdruck für Ziffern
    const digitsOnlyRegex = /^\d+$/;
    // Regulärer Ausdruck für eine vierstellige Jahreszahl
    const yearRegex = /^\d{4}$/;
    // Aktuelles Jahr ermitteln
    const currentYear = new Date().getFullYear();

    // Überprüfen, ob alle Eingabefelder ausgefüllt sind
    // Überprüfen, ob die Gruppe bereits angezeigt wird
    if (displayedMemberStartNbrs.includes(parseInt(startnbrInput))) {
        alert("Startnummer ist bereits vergeben!")
        return; // Bereits angezeigte Gruppe überspringen
    } else if (firstnameInput === "" || lastnameInput === "" || birthyearInput === "" || genderInput === "" || startnbrInput === "") {
        alert("Bitte füllen Sie alle Felder aus.");
        return; // Die Funktion wird beendet, wenn nicht alle Felder ausgefüllt sind
    } else if ((!lettersOnlyRegex.test(firstnameInput)) || (!lettersOnlyRegex.test(lastnameInput))) {
        alert("Bitte für den Namen nur Buchstaben verwenden.");
        return;
    } else if (!digitsOnlyRegex.test(startnbrInput)) {
        alert("Bitte für die Startnummer nur Ziffern von 1-9 verwenden.");
        return;
    } else if (!(yearRegex.test(birthyearInput) && parseInt(birthyearInput) <= currentYear)) {
        alert("Bitte eine gültige Jahreszahl eingeben.");
        return;
    }

    jsonData.bodinger = jsonData.bodinger == "Ja" ? "Ja" : "Nein";
    jsonData.cupmember = jsonData.cupmember == "Ja" ? "Ja" : "Nein";

    try {
        const response = await fetch('/members', {
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
                const response = await fetch('/members');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const members = await response.json();
                displayMembers(members);
            } 
            catch (error) {
                console.error('Error fetching data:', error);
            }

            // Formularfelder leeren
            document.getElementById("startnbr").value = "";
            document.getElementById("firstname").value = "";
            document.getElementById("lastname").value = "";
            document.getElementById("club").value = "";
            document.getElementById("birthyear").value = "";
            document.getElementById("gender").value = "default";
            document.getElementById("bodinger").checked = false;
            document.getElementById("cupmember").checked = false;

        } else {
            console.error("Fehler beim Hinzufügen:", response.statusText);
        }
    } catch (error) {
        console.error("Fehler:", error);
    }
};

function displayMembers(members) {
    const table = document.getElementById('membertable');
    if (!table) {
        throw new Error('Element mit der ID "membertable" wurde nicht gefunden.');
    }

    members.forEach(member => {
        // Überprüfen, ob die Gruppe bereits angezeigt wird
        if (displayedMemberStartNbrs.includes(member.startnbr)) {
            return; // Bereits angezeigte Gruppe überspringen
        }

        // Tabellenkörper erstellen
        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        let dataBodinger = member.bodinger == "Ja" ? "Ja" : "Nein";
        let dataCupmember = member.cupmember == "Ja" ? "Ja" : "Nein";

        tr.innerHTML = `
        <td>${member.startnbr}</td>
        <td>${member.firstname}</td>
        <td>${member.lastname}</td>
        <td>${member.club}</td>
        <td>${member.birthyear}</td>
        <td>${member.gender}</td>
        <td>${dataBodinger}</td>
        <td>${dataCupmember}</td>
        `;
        tbody.appendChild(tr);

        // Tabellenkörper zu Tabelle hinzufügen
        table.appendChild(tbody);

        // ID zur Liste der angezeigten Gruppen hinzufügen
        displayedMemberStartNbrs.push(member.startnbr);
    });
}

async function deleteSelectedMemberRow(selectedMemberRow) {
    if (selectedMemberRow) {

        const memberStartnbr = selectedMemberRow.firstElementChild.textContent;
        console.log("Deleting member with ID:", memberStartnbr);

        if (memberStartnbr) {
            try {
                const response = await fetch(`/members/${memberStartnbr}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    selectedMemberRow.remove(); // Die ausgewählte Zeile entfernen
                } else {
                    alert('Failed to delete the member.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the member.');
            }
        } else {
            alert('No group ID provided.');
        }
        selectedMemberRow = null; // Die Auswahl zurücksetzen
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

    jsonData.bodinger = jsonData.bodinger == "Ja" ? "Ja" : "Nein";

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
        let dataBodinger = group.bodinger == "Ja" ? "Ja" : "Nein";

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

// time recording
function timeRecording() {

    //******************************************************************
    // load member values via startnbr
    //******************************************************************
    loadMemberValues();

    //******************************************************************
    // set time to member
    //******************************************************************
    const buttonAddTime = document.getElementById("buttonAddTime");
    if (!buttonAddTime) {
        console.error('Element mit der ID "buttonAddTime" wurde nicht gefunden.');
        return;
    }

    buttonAddTime.addEventListener("click", (event) => {
        event.preventDefault(); // Verhindert die Standardaktion des Ereignisses (in diesem Fall das Neuladen der Seite)
        setTime();
    });
    
}

function loadMemberValues() {
    const startnbrInput = document.getElementById("startnbr");
    if (!startnbrInput) {
        console.error('Element mit der ID "startnbr" wurde nicht gefunden.');
        return;
    }

    const firstnameInput = document.getElementById('firstname');
    const lastnameInput = document.getElementById('lastname');
    const clubInput = document.getElementById('club');
    const birthyearInput = document.getElementById('birthyear');
    const genderInput = document.getElementById('gender');
    const bodingerInput = document.getElementById('bodinger');
    const cupmemberInput = document.getElementById('cupmember');
    const minInput = document.getElementById('min');
    const secInput = document.getElementById('sec');
    const msInput = document.getElementById('ms');

    startnbrInput.addEventListener("blur", () => {
        const startnbr = startnbrInput.value;
        if (startnbr) {
            fetch(`/members/${startnbr}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else if (response.status === 404) {
                        throw new Error('Startnummer nicht gefunden');
                    } else {
                        throw new Error('Serverfehler: ' + response.status);
                    }
                })
                .then(data => {
                    // Daten in die Input-Felder einfügen
                    firstnameInput.value = data.firstname || '';
                    lastnameInput.value = data.lastname || '';
                    clubInput.value = data.club || '';
                    birthyearInput.value = data.birthyear || '';
                    genderInput.value = data.gender || '';
                    bodingerInput.value = data.bodinger == "Ja" ? "Ja" : "Nein";
                    cupmemberInput.value = data.cupmember == "Ja" ? "Ja" : "Nein";
                    minInput.value = data.min || '';
                    secInput.value = data.sec || '';
                    msInput.value = data.ms || '';

                    firstnameInput.innerText = firstnameInput.value;
                    lastnameInput.innerText = lastnameInput.value;
                    clubInput.innerText = clubInput.value;
                    birthyearInput.innerText = birthyearInput.value;
                    genderInput.innerText = genderInput.value;
                    bodingerInput.innerText = bodingerInput.value;
                    cupmemberInput.innerText = cupmemberInput.value;
                    minInput.innerText = minInput.value;
                    secInput.innerText = secInput.value;
                    msInput.innerText = msInput.value;
                    
                })
                .catch(error => {
                    // Fehler behandeln und anzeigen
                    alert(error.message);

                    startnbrInput.value = ''
                    firstnameInput.value = '';
                    lastnameInput.value = '';
                    clubInput.value = '';
                    birthyearInput.value = '';
                    genderInput.value = '';
                    bodingerInput.value = '';
                    cupmemberInput.value = '';
                    minInput.value = '';
                    secInput.value = '';
                    msInput.value = '';

                    startnbrInput.innerText = startnbrInput.value;
                    firstnameInput.innerText = firstnameInput.value;
                    lastnameInput.innerText = lastnameInput.value;
                    clubInput.innerText = clubInput.value;
                    birthyearInput.innerText = birthyearInput.value;
                    genderInput.innerText = genderInput.value;
                    bodingerInput.innerText = bodingerInput.value;
                    cupmemberInput.innerText = cupmemberInput.value;
                    minInput.innerText = minInput.value;
                    secInput.innerText = secInput.value;
                    msInput.innerText = msInput.value;
                });
        }
    });
}

async function setTime() {
    const form = document.getElementById("timeForm");
    if (!form) {
        console.error('Element mit der ID "timeForm" wurde nicht gefunden.');
        return;
    }

    const formData = new FormData(form);
    const jsonData = {};

    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    // Formulareingaben abrufen
    const startnbrInput = jsonData.startnbr;
    const minInput = jsonData.min;
    const secInput = jsonData.sec;
    const msInput = jsonData.ms;

    // Regulärer Ausdruck für eine vierstellige Jahreszahl
    const maxTwoDigitRegEx = /^\d{1,2}$/;

    // Überprüfen, ob alle Eingabefelder ausgefüllt sind
    if (startnbrInput === "" || minInput === "" || secInput === "" || msInput === "") {
        alert("Bitte füllen Sie alle Felder aus.");
        return; // Die Funktion wird beendet, wenn nicht alle Felder ausgefüllt sind
    } else if ( !maxTwoDigitRegEx.test(minInput) ) {
        alert("Es darf nur eine 2 stellige Zahl für Minuten eingegeben werden.");
        return;
    } else if ( !(maxTwoDigitRegEx.test(secInput) && (secInput >= 0) && (secInput <= 59) ) ) {
        alert("Es darf nur eine 2 stellige Zahl (0-59) für Sekunden eingegeben werden.");
        return;
    } else if ( !(maxTwoDigitRegEx.test(msInput) && (msInput >= 0) && (msInput <= 99) ) ) {
        alert("Es darf nur eine 2 stellige Zahl (0-99) für Hundertstel eingegeben werden.");
        return;
    }

    const startnbr = startnbrInput;

    try {
        const response = await fetch(`/members/${startnbr}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });
        
        if (response.status === 200) {
          alert('Zeit wurde erfolgreich aktualisiert.');
        } else if (response.status === 201) {
          alert('Neuer Teilnehmer erfolgreich hinzugefügt.');
        } else {
          alert('Ein Fehler ist aufgetreten.');
        }
    } catch (error) {
        console.error('Fehler bei der Anfrage:', error);
        alert('Ein Fehler ist aufgetreten.');
    }
}

// result list
async function resultList() {
    //******************************************************************
    // load groups
    //******************************************************************
    try {
        const response = await fetch('/groups');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const groups = await response.json();
        loadResults(groups);
    } 
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function loadResults(groups) {
    const results = document.getElementById('results');
    if (!results) {
        throw new Error('Element mit der ID "results" wurde nicht gefunden.');
    }

    try {
        const response = await fetch('/members');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const members = await response.json();

        // Mitglieder nach Zeit sortieren
        const sortedMembers = members.slice().sort((a, b) => {
            return getTotalMilliseconds(a) - getTotalMilliseconds(b);
        });

        // Ergebnis anzeigen
        console.log(sortedMembers);

        groups.forEach(group => {
            // Liste erstellen
            const h2 = document.createElement('h2');
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const trHead = document.createElement('tr');
            const tbody = document.createElement('tbody');

            h2.innerText = group.name;
            trHead.innerHTML = `
                <th>Platzierung</th>
                <th>Startnummer</th>
                <th>Vorname</th>
                <th>Nachname</th>
                <th>Verein</th>
                <th>Jahrgang</th>
                <th>Cupteilnehmer</th>
                <th>Zeit</th>
                `;

            let placement = 1;

            sortedMembers.forEach(sortedMember => {
                if ( (sortedMember.birthyear >= group.startYear) && (sortedMember.birthyear <= group.endYear) && 
                     (sortedMember.bodinger === group.bodinger) && (sortedMember.gender === group.gender) )
                {
                    const trBody = document.createElement('tr');
                    trBody.innerHTML = `
                        <td>${placement}.</td>
                        <td>${sortedMember.startnbr}</td>
                        <td>${sortedMember.firstname}</td>
                        <td>${sortedMember.lastname}</td>
                        <td>${sortedMember.club}</td>
                        <td>${sortedMember.birthyear}</td>
                        <td>${sortedMember.cupmember}</td>
                        <td>${sortedMember.min}:${sortedMember.sec > 9 ? sortedMember.sec : '0' + sortedMember.sec}:${sortedMember.ms > 9 ? sortedMember.ms : '0' + sortedMember.ms}</td>
                        `;
                    tbody.appendChild(trBody);
                    placement++;
                }
            });
            
            thead.appendChild(trHead);
            table.appendChild(thead);
            table.appendChild(tbody);
            results.appendChild(h2);
            results.appendChild(table);
        });
    } 
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

function getTotalMilliseconds(member) {
    return member.min * 60 * 1000 + member.sec * 1000 + member.ms * 10;
}

function drucken() {
    window.print();
}