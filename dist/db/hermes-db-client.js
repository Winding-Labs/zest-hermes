// src/db/hermes-db-client.ts
import { Database } from "bun:sqlite";
import { existsSync } from "node:fs";

class HermesDbSqliteClient {
  dbPath;
  logger;
  db = null;
  constructor(dbPath, logger) {
    this.dbPath = dbPath;
    this.logger = logger;
  }
  isAvailable() {
    return existsSync(this.dbPath);
  }
  getSessionsAfter(epoch) {
    const db = this.ensureDb();
    return epoch !== null ? db.query("SELECT * FROM sessions WHERE started_at > ? ORDER BY started_at ASC").all(epoch) : db.query("SELECT * FROM sessions ORDER BY started_at ASC").all();
  }
  getMessagesAfter(lastId) {
    const db = this.ensureDb();
    return db.query("SELECT * FROM messages WHERE id > ? ORDER BY id ASC").all(lastId);
  }
  getWatermarks() {
    const db = this.ensureDb();
    const row = db.query("SELECT (SELECT max(started_at) FROM sessions) as max_epoch, (SELECT max(id) FROM messages) as max_id").get();
    return {
      maxSessionEpoch: row.max_epoch,
      maxMessageId: row.max_id ?? 0
    };
  }
  close() {
    try {
      this.db?.close();
    } catch {}
    this.db = null;
  }
  ensureDb() {
    if (this.db)
      return this.db;
    this.db = new Database(this.dbPath, { readonly: true });
    return this.db;
  }
}
export {
  HermesDbSqliteClient
};
