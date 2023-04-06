import Database from "better-sqlite3";
import type { Message } from "./types";

const db = new Database("database.db");
db.pragma("journal_mode = WAL");
db.prepare(`
  CREATE TABLE IF NOT EXISTS history (
    sessionId TEXT,
    timestamp DATETIME,
    role TEXT,
    content TEXT,
    PRIMARY KEY (sessionId, timestamp)
  )
`).run();

function getHistory(sessionId: string): Message[] {
  return db.prepare(`
    SELECT role, content
    FROM history
    WHERE sessionId = ?
    ORDER BY timestamp
  `).all(sessionId);
}

function addHistory(sessionId: string, role: string, content: string) {
  db.prepare(`
    INSERT INTO history (sessionId, timestamp, role, content)
    VALUES (?, datetime('now'), ?, ?)
  `).run(sessionId, role, content);
}

function clearHistory(sessionId: string) {
  db.prepare(`
    DELETE FROM history
    WHERE sessionId = ?
  `).run(sessionId);
}


export { getHistory, addHistory, clearHistory };
