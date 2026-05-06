// src/db/hermes-db-client.test.ts
import { Database as Database2 } from "bun:sqlite";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync as existsSync2, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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

// src/db/hermes-db-client.test.ts
var TEST_DIR = join(tmpdir(), "hermes-db-client-test");
var DB_PATH = join(TEST_DIR, "state.db");
var EPOCH_BASE = 1776436892.92733;
function createTestDb() {
  const db = new Database2(DB_PATH);
  db.exec(`
    CREATE TABLE sessions (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      user_id TEXT,
      model TEXT,
      started_at REAL NOT NULL,
      ended_at REAL,
      end_reason TEXT,
      message_count INTEGER DEFAULT 0,
      tool_call_count INTEGER DEFAULT 0,
      input_tokens INTEGER DEFAULT 0,
      output_tokens INTEGER DEFAULT 0,
      cache_read_tokens INTEGER DEFAULT 0,
      cache_write_tokens INTEGER DEFAULT 0,
      reasoning_tokens INTEGER DEFAULT 0,
      estimated_cost_usd REAL,
      actual_cost_usd REAL,
      title TEXT
    );

    CREATE TABLE messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL REFERENCES sessions(id),
      role TEXT NOT NULL,
      content TEXT,
      tool_call_id TEXT,
      tool_calls TEXT,
      tool_name TEXT,
      timestamp REAL NOT NULL,
      token_count INTEGER,
      finish_reason TEXT
    );
  `);
  return db;
}
describe("HermesDbSqliteClient", () => {
  beforeEach(() => {
    if (existsSync2(TEST_DIR))
      rmSync(TEST_DIR, { recursive: true });
    mkdirSync(TEST_DIR, { recursive: true });
  });
  afterEach(() => {
    if (existsSync2(TEST_DIR))
      rmSync(TEST_DIR, { recursive: true });
  });
  test("isAvailable returns false when db does not exist", () => {
    const client = new HermesDbSqliteClient("/nonexistent/state.db");
    expect(client.isAvailable()).toBe(false);
  });
  test("isAvailable returns true when db exists", () => {
    const db = createTestDb();
    db.close();
    const client = new HermesDbSqliteClient(DB_PATH);
    expect(client.isAvailable()).toBe(true);
    client.close();
  });
  test("getSessionsAfter(null) returns all sessions", () => {
    const db = createTestDb();
    db.exec(`
      INSERT INTO sessions (id, source, model, started_at, title)
      VALUES ('sess_1', 'cli', 'claude-3.5', ${EPOCH_BASE}, 'First');

      INSERT INTO sessions (id, source, model, started_at, title)
      VALUES ('sess_2', 'cli', 'claude-3.5', ${EPOCH_BASE + 100}, 'Second');
    `);
    db.close();
    const client = new HermesDbSqliteClient(DB_PATH);
    const rows = client.getSessionsAfter(null);
    expect(rows).toHaveLength(2);
    expect(rows[0].id).toBe("sess_1");
    expect(rows[0].started_at).toBe(EPOCH_BASE);
    expect(rows[1].id).toBe("sess_2");
    client.close();
  });
  test("getSessionsAfter(epoch) returns only newer sessions", () => {
    const db = createTestDb();
    db.exec(`
      INSERT INTO sessions (id, source, model, started_at)
      VALUES ('sess_1', 'cli', 'claude-3.5', ${EPOCH_BASE});

      INSERT INTO sessions (id, source, model, started_at)
      VALUES ('sess_2', 'cli', 'claude-3.5', ${EPOCH_BASE + 100});
    `);
    db.close();
    const client = new HermesDbSqliteClient(DB_PATH);
    const rows = client.getSessionsAfter(EPOCH_BASE);
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe("sess_2");
    client.close();
  });
  test("getMessagesAfter returns messages with id > lastId", () => {
    const db = createTestDb();
    db.exec(`
      INSERT INTO sessions (id, source, model, started_at)
      VALUES ('sess_1', 'cli', 'claude-3.5', ${EPOCH_BASE});

      INSERT INTO messages (session_id, role, content, timestamp)
      VALUES ('sess_1', 'user', 'First', ${EPOCH_BASE + 1});

      INSERT INTO messages (session_id, role, content, timestamp)
      VALUES ('sess_1', 'assistant', 'Second', ${EPOCH_BASE + 2});

      INSERT INTO messages (session_id, role, content, timestamp)
      VALUES ('sess_1', 'user', 'Third', ${EPOCH_BASE + 3});
    `);
    db.close();
    const client = new HermesDbSqliteClient(DB_PATH);
    const rows = client.getMessagesAfter(1);
    expect(rows).toHaveLength(2);
    expect(rows[0].content).toBe("Second");
    expect(rows[1].content).toBe("Third");
    client.close();
  });
  test("getMessagesAfter returns all rows with message fields", () => {
    const db = createTestDb();
    db.exec(`
      INSERT INTO sessions (id, source, model, started_at)
      VALUES ('sess_1', 'cli', 'claude-3.5', ${EPOCH_BASE});

      INSERT INTO messages (session_id, role, content, timestamp, tool_name, finish_reason, token_count)
      VALUES ('sess_1', 'assistant', 'Done', ${EPOCH_BASE + 1}, 'bash', 'tool_calls', 150);
    `);
    db.close();
    const client = new HermesDbSqliteClient(DB_PATH);
    const rows = client.getMessagesAfter(0);
    expect(rows).toHaveLength(1);
    expect(rows[0].tool_name).toBe("bash");
    expect(rows[0].finish_reason).toBe("tool_calls");
    expect(rows[0].token_count).toBe(150);
    client.close();
  });
  test("close can be called multiple times safely", () => {
    const db = createTestDb();
    db.close();
    const client = new HermesDbSqliteClient(DB_PATH);
    client.getSessionsAfter(null);
    client.close();
    client.close();
  });
});
