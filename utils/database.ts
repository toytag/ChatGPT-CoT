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
// implicit rowid as primary key, sessionToken as non-unique search index, both B-tree indexes
// lookup by sessionToken is O(log n) instead of O(n); and sort by rowid is O(1)
db.prepare(`
  CREATE TABLE IF NOT EXISTS history (
    sessionToken  TEXT      NOT NULL,
    role          TEXT      NOT NULL,
    content       TEXT      NOT NULL,
    timestamp     DATETIME  NOT NULL  DEFAULT CURRENT_TIMESTAMP
  )
`).run();
db.prepare(`
  CREATE INDEX IF NOT EXISTS history_sessionToken
  ON history (sessionToken)
`).run();

function getHistory(sessionToken: string): Message[] {
  return db.prepare(`
    SELECT role, content
    FROM history
    WHERE sessionToken = ?
    ORDER BY rowid ASC
  `).all(sessionToken);
}

function addHistory(sessionToken: string, role: Role, content: string) {
  db.prepare(`
    INSERT INTO history (sessionToken, role, content)
    VALUES (?, ?, ?)
  `).run(sessionToken, role, content);
}

function clearHistory(sessionToken: string) {
  db.prepare(`
    DELETE FROM history
    WHERE sessionToken = ?
  `).run(sessionToken);
}

export { getHistory, addHistory, clearHistory };
