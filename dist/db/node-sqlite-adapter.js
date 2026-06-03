// src/db/node-sqlite-adapter.ts
import { DatabaseSync } from "node:sqlite";

class Database {
  db;
  constructor(path, options) {
    this.db = new DatabaseSync(path, {
      open: true,
      readOnly: options?.readonly ?? false
    });
  }
  query(sql) {
    const db = this.db;
    return {
      all(...params) {
        const stmt = db.prepare(sql);
        return params.length > 0 ? stmt.all(...params) : stmt.all();
      },
      get(...params) {
        const stmt = db.prepare(sql);
        const row = params.length > 0 ? stmt.get(...params) : stmt.get();
        return row ?? null;
      }
    };
  }
  close() {
    this.db.close();
  }
}
export {
  Database
};
