const express = require("express");
const path = require("path");
const SQLiteMemberMangager = require("./static/scripts/SQLiteManager");


const PORT = 8000;
const HOST = "localhost";

const app = express();
app.use(express.json());
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

const sqliteManager = new SQLiteMemberMangager();


//******************************************************************
// load pages
//******************************************************************
app.get('/', (req, res) => {
  const pathToFile = path.join(__dirname, 'static', 'html', 'index.html');
  res.sendFile(pathToFile);
});

app.get('/gm', (req, res) => {
  const pathToFile = path.join(__dirname, 'static', 'html', 'group_management.html');
  res.sendFile(pathToFile);
});

app.get('/pp', (req, res) => {
  const pathToFile = path.join(__dirname, 'static', 'html', 'participant_processing.html');
  res.sendFile(pathToFile);
});

app.get('/tr', (req, res) => {
  const pathToFile = path.join(__dirname, 'static', 'html', 'time_recording.html');
  res.sendFile(pathToFile);
});

app.get('/rl', (req, res) => {
  const pathToFile = path.join(__dirname, 'static', 'html', 'result_list.html');
  res.sendFile(pathToFile);
});

//******************************************************************
// functions
//******************************************************************
app.post('/process-form', async (req, res) => {
    const member = req.body;
    const id = await sqliteManager.addMember(member);
    member.href = `/process-form${id}`;
    res
      .status(201)
      .location(`/process-form/${id}`)
      .send(member);
  });

app.post('/groups', async (req, res) => {
    const group = req.body;
    const id = await sqliteManager.addGroup(group);
    group.href = `/groups${id}`;
    res
      .status(201)
      .location(`/groups/${id}`)
      .send(group);
  });

  app.get('/groups', async (req, res) => {
    const groups = await sqliteManager.getGroups();
    groups.forEach((group) => {
      group.href = `/groups${group.id}`;
    });
    res.status(200).send(groups);
  });



const server = app.listen(PORT, () => {
    console.log(`Webservice läuft unter http://${HOST}:${PORT}`);
});