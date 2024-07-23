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

// membertable
app.post('/members', async (req, res) => {
    const member = req.body;
    const startnbr = await sqliteManager.addMember(member);
    member.href = `/members{startnbr}`;
    res
      .status(201)
      .location(`/members/${startnbr}`)
      .send(member);
});

app.get('/members', async (req, res) => {
  const members = await sqliteManager.getMembers();
  members.forEach((member) => {
    member.href = `/members${member.startnbr}`;
  });
  res.status(200).send(members);
});

app.delete('/members/:startnbr', async (req, res) => {
  const startnbr = parseInt(req.params.startnbr);
  await sqliteManager.deleteMember(startnbr);
  res.status(200).send();
});

app.get('/members/:startnbr', async (req, res) => {
  const startnbr = parseInt(req.params.startnbr);
  const member = await sqliteManager.getMember(startnbr);
  if (member) {
    res.status(200).send(member);
  } else {
    res.status(404).send();
  }
});

app.put('/members/:startnbr', async (req, res) => {
  const startnbr = parseInt(req.params.startnbr);
  const existingMember = await sqliteManager.getMember(startnbr);
  if (existingMember) {
    const member = req.body;
    await sqliteManager.updateMember(startnbr, member);
    res.status(200).send();
  } else {
    const member = req.body;
    const startnbr = await sqliteManager.addMember(member);
    res
      .status(201)
      .location(`/members/${startnbr}`)
      .send();
  }
});


// grouptable
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

app.delete('/groups/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await sqliteManager.deleteGroup(id);
  res.status(200).send();
});


const server = app.listen(PORT, () => {
    console.log(`Webservice läuft unter http://${HOST}:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
      console.error('Port 8000 is already in use');
      process.exit(1);
  } else {
      throw error;
  }
});