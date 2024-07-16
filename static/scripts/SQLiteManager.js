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
        db.run(`
            CREATE TABLE IF NOT EXISTS 
                groups (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    name TEXT, 
                    startYear INTEGER, 
                    endYear INTEGER,
                    gender TEXT,
                    bodinger INTEGER
                )`
        );
    }

    //******************************************************************
    // CRUD methods for members table
    //******************************************************************
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

    async getMember(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM members WHERE id = ?", [id], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async updateMember(id, member) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE members SET 
                firstName = ?, 
                lastName = ?, 
                birthyear = ?,
                gender = ?, 
                WHERE id = ?`,
                [member.fname, member.sname, member.birthyear, member.gender, id],
                (error, row) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }

    async deleteMember(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM members WHERE id = ?", [id], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async getMembers() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM members", [], (error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    //******************************************************************
    // CRUD methods for groups table
    //******************************************************************
    async addGroup(group) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT
                INTO groups (name, startYear, endYear, gender, bodinger)
                VALUES (?, ?, ?, ?, ?)`,
                [group.name, group.startYear, group.endYear, group.gender, group.bodinger],
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

    async getGroup(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM groups WHERE id = ?", [id], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async updateGroup(id, group) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE groups SET 
                name = ?, 
                startYear = ?, 
                endYear = ?,
                gender = ?, 
                bodinger = ?,
                WHERE id = ?`,
                [group.name, group.startYear, group.endYear, group.gender, group.bodinger, id],
                (error, row) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }

    async deleteGroup(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM groups WHERE id = ?", [id], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async getGroups() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM groups", [], (error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
            });
        });
    }
};