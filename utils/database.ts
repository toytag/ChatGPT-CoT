import Database from "better-sqlite3";
import type { Message, Role } from "./types";

const db = new Database("database.db");
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
// handle db close on process exit
process.on("exit", () => {
  db.pragma("analysis_limit = 1024");
  db.pragma("optimize");
  db.close();
});
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));
// SQLite Query Optimization: https://www.sqlite.org/queryplanner.html
// implicit rowid as primary key, sessionID as non-unique search index, both B-tree indexes
// lookup by sessionID is O(log n) instead of O(n); and sort by rowid is O(1)
db.prepare(`
  CREATE TABLE IF NOT EXISTS history (
    sessionID   TEXT      NOT NULL,
    role        TEXT      NOT NULL,
    content     TEXT      NOT NULL,
    timestamp   DATETIME  NOT NULL  DEFAULT CURRENT_TIMESTAMP
  )
`).run();
db.prepare(`
  CREATE INDEX IF NOT EXISTS history_sessionID
  ON history (sessionID)
`).run();

function getHistory(sessionID: string): Message[] {
  return db.prepare(`
    SELECT role, content
    FROM history
    WHERE sessionID = ?
    ORDER BY rowid ASC
  `).all(sessionID);
}

function addHistory(sessionID: string, role: Role, content: string) {
  db.prepare(`
    INSERT INTO history (sessionID, role, content)
    VALUES (?, ?, ?)
  `).run(sessionID, role, content);
}

function clearHistory(sessionID: string) {
  db.prepare(`
    DELETE FROM history
    WHERE sessionID = ?
  `).run(sessionID);
}

// periodically delete history older than a week (7 days)
setInterval(() => {
  db.prepare(`
    DELETE FROM history
    WHERE timestamp < datetime('now', '-7 days')
  `).run();
}, 24 * 60 * 60 * 1000);

export { getHistory, addHistory, clearHistory };
