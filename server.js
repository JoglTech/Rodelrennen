const express = require("express");
const path = require("path");
const SQLiteMemberMangager = require("./static/scripts/SQLiteManager");


const PORT = 8000;
const HOST = "localhost";

const app = express();
app.use(express.json());
app.use(express.static('static'));
app.use(express.urlencoded({
  extended: true
}));

const sqliteManager = new SQLiteMemberMangager();

app.get('/', (req, res) => {
  const pathToFile = path.join(__dirname, 'static', 'html', 'index.html');
  res.sendFile(pathToFile);
});


app.post('/process-form', async (req, res) => {
    const member = req.body;
    const id = await sqliteManager.addMember(member);
    member.href = `/process-form${id}`;
    res
      .status(201)
      .location(`/process-form/${id}`)
      .send(member);
  });

const server = app.listen(PORT, () => {
    console.log(`Webservice läuft unter http://${HOST}:${PORT}`);
});