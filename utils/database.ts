import Database from "better-sqlite3";
import type { Message } from "./types";

const db = new Database("database.db");
db.pragma("journal_mode = WAL");
db.prepare(`
  CREATE TABLE IF NOT EXISTS history (
    sessionToken TEXT,
    timestamp DATETIME,
    role TEXT,
    content TEXT,
    PRIMARY KEY (sessionToken, timestamp)
  )
`).run();

function getHistory(sessionToken: string): Message[] {
  return db.prepare(`
    SELECT role, content
    FROM history
    WHERE sessionToken = ?
    ORDER BY timestamp
  `).all(sessionToken);
}

function addHistory(sessionToken: string, role: string, content: string) {
  db.prepare(`
    INSERT INTO history (sessionToken, timestamp, role, content)
    VALUES (?, datetime('now'), ?, ?)
  `).run(sessionToken, role, content);
}

function clearHistory(sessionToken: string) {
  db.prepare(`
    DELETE FROM history
    WHERE sessionToken = ?
  `).run(sessionToken);
}


export { getHistory, addHistory, clearHistory };
