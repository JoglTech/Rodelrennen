const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("rodelrennen.db");

module.exports = class SQLiteMemberMangager {
    constructor() {
        this.init();
    }

    init() {
        db.run(`
            CREATE TABLE IF NOT EXISTS 
                members (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    firstName TEXT, 
                    lastName TEXT, 
                    birthyear INTEGER,
                    gender TEXT
                )`
        );
    }

    async addMember(member) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT
                INTO members (firstName, lastName, birthyear, gender)
                VALUES (?, ?, ?, ?)`,
                [member.fname, member.sname, member.birthyear, member.gender],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }
}