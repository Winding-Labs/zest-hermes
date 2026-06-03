// src/utils/logger.ts
import { createWriteStream, mkdirSync } from "node:fs";
import { join as join2 } from "node:path";

// src/config/constants.ts
import { homedir } from "node:os";
import { join } from "node:path";
var HERMES_HOME = process.env.HERMES_DIR ?? join(homedir(), ".hermes");
var HERMES_ZEST_HOME = join(homedir(), ".hermes-zest");
var HERMES_CONFIG_PATH = join(HERMES_HOME, "config.yaml");
var STATE_DB_PATH = join(HERMES_HOME, "state.db");
var CHECKPOINT_PATH = join(HERMES_ZEST_HOME, "state.json");
var PENDING_FINALIZE_FILE = join(HERMES_ZEST_HOME, "pending-finalize");
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
async function flushLogger() {
  const s = stream;
  if (!s)
    return;
  stream = null;
  await new Promise((resolve) => {
    s.end(() => resolve());
  });
}
export {
  logger,
  flushLogger
};
