#!/usr/bin/env node

// src/utils/ignored-sessions.ts
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join as join3 } from "node:path";

// src/config/constants.ts
import { homedir } from "node:os";
import { join } from "node:path";
var HERMES_HOME = process.env.HERMES_DIR ?? join(homedir(), ".hermes");
var HERMES_ZEST_HOME = join(homedir(), ".hermes-zest");
var HERMES_CONFIG_PATH = join(HERMES_HOME, "config.yaml");
var STATE_DB_PATH = join(HERMES_HOME, "state.db");
var CHECKPOINT_PATH = join(HERMES_ZEST_HOME, "state.json");
var QUEUE_DIR = join(HERMES_ZEST_HOME, "queue");
var EVENTS_QUEUE_FILE = join(QUEUE_DIR, "events.jsonl");
var SESSIONS_QUEUE_FILE = join(QUEUE_DIR, "chat-sessions.jsonl");
var MESSAGES_QUEUE_FILE = join(QUEUE_DIR, "chat-messages.jsonl");
var STATE_DIR = join(HERMES_ZEST_HOME, "state");
var LOGS_DIR = join(HERMES_ZEST_HOME, "logs");
var SESSION_FILE = process.env.ZEST_SESSION_FILE ?? join(HERMES_ZEST_HOME, "session.json");
var SETTINGS_FILE = join(HERMES_ZEST_HOME, "settings.json");
var DAEMON_PID_FILE = join(HERMES_ZEST_HOME, "daemon.pid");
var DAEMON_LOG_FILE = join(HERMES_ZEST_HOME, "daemon.log");
var ACTIVE_SESSIONS_FILE = join(HERMES_ZEST_HOME, "active-sessions");
var SYNC_METRICS_FILE = join(HERMES_ZEST_HOME, "sync-metrics.jsonl");
var SYNC_METRICS_RETENTION_MS = 60 * 60 * 1000;
var STATUS_CACHE_FILE = process.env.ZEST_STATUS_CACHE_FILE ?? join(HERMES_ZEST_HOME, "status-cache.json");
var VERSION_CHECK_INTERVAL_MS = 60 * 60 * 1000;
var UPDATE_CHECK_CACHE_TTL_MS = 60 * 60 * 1000;
var STALE_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000;
var NOTIFICATION_DURATION_MS = 5 * 60 * 1000;
var STANDUP_NOTIFICATION_THROTTLE_MS = 2 * 60 * 60 * 1000;

// src/utils/logger.ts
import { createWriteStream, mkdirSync } from "node:fs";
import { join as join2 } from "node:path";
var stream = null;
var streamFailed = false;
var currentDate = "";
function getStream() {
  const today = new Date().toISOString().split("T")[0];
  if (stream && today !== currentDate) {
    stream.end();
    stream = null;
    streamFailed = false;
  }
  currentDate = today;
  if (stream)
    return stream;
  if (streamFailed)
    return null;
  try {
    mkdirSync(LOGS_DIR, { recursive: true });
    const logFile = join2(LOGS_DIR, `plugin-${today}.log`);
    stream = createWriteStream(logFile, { flags: "a" });
    stream.on("error", () => {
      streamFailed = true;
      stream = null;
    });
    return stream;
  } catch {
    streamFailed = true;
    return null;
  }
}
function log(level, msg, ...args) {
  const timestamp = new Date().toISOString();
  const suffix = args.length ? ` ${args.map((a) => a instanceof Error ? a.message : JSON.stringify(a)).join(" ")}` : "";
  const line = `[${timestamp}] [${level}] ${msg}${suffix}
`;
  try {
    getStream()?.write(line);
  } catch {}
}
var logger = {
  debug: (msg, ...args) => log("DEBUG", msg, ...args),
  info: (msg, ...args) => log("INFO", msg, ...args),
  warn: (msg, ...args) => {
    console.warn(`[Zest:Warn] ${msg}`, ...args);
    log("WARN", msg, ...args);
  },
  error: (msg, ...args) => {
    console.error(`[Zest:Error] ${msg}`);
    log("ERROR", msg, ...args);
  }
};

// src/utils/ignored-sessions.ts
var IGNORED_SESSIONS_FILE = join3(HERMES_ZEST_HOME, "ignored-sessions.json");
async function loadIgnoredSessions() {
  try {
    const content = await readFile(IGNORED_SESSIONS_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      logger.warn("ignored_sessions_invalid_format", { expected: "array" });
      return new Set;
    }
    return new Set(parsed.filter((id) => typeof id === "string"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      logger.warn("ignored_sessions_load_failed", error);
    }
    return new Set;
  }
}
async function saveIgnoredSessions(sessions) {
  await mkdir(dirname(IGNORED_SESSIONS_FILE), { recursive: true });
  await writeFile(IGNORED_SESSIONS_FILE, JSON.stringify([...sessions], null, 2), "utf-8");
}
async function addIgnoredSession(sessionId) {
  const sessions = await loadIgnoredSessions();
  if (sessions.has(sessionId))
    return false;
  sessions.add(sessionId);
  await saveIgnoredSessions(sessions);
  return true;
}

// src/commands/ignore-session.ts
async function main() {
  try {
    const sessionId = process.argv[2];
    if (!sessionId) {
      console.log("❌ No session ID provided");
      process.exit(1);
    }
    const added = await addIgnoredSession(sessionId);
    if (!added) {
      console.log("✓ This session is already ignored");
      console.log(`   id: ${sessionId}`);
      return;
    }
    console.log("✅ Session ignored");
    console.log(`   id: ${sessionId}`);
    console.log("");
    console.log("\uD83D\uDEAB This session will no longer be synced or included in standups");
    console.log("\uD83D\uDCA1 Use /zest_unignore to reverse");
  } catch (error) {
    logger.error("Failed to ignore session", error);
    console.error("❌ Failed to ignore session: " + (error instanceof Error ? error.message : "Unknown error"));
    process.exit(1);
  }
}
main();
