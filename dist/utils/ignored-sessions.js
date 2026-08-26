// src/utils/ignored-sessions.ts
import { mkdir as mkdir2, readFile, writeFile } from "node:fs/promises";
import { dirname as dirname2, join as join3 } from "node:path";

// src/config/constants.ts
import { homedir } from "node:os";
import { join } from "node:path";
var HERMES_HOME = process.env.HERMES_DIR ?? join(homedir(), ".hermes");
var HERMES_ZEST_HOME = process.env.ZEST_HERMES_STATE_DIR ?? join(homedir(), ".hermes-zest");
var HERMES_CONFIG_PATH = join(HERMES_HOME, "config.yaml");
var STATE_DB_PATH = join(HERMES_HOME, "state.db");
var CHECKPOINT_PATH = join(HERMES_ZEST_HOME, "state.json");
var PENDING_FINALIZE_FILE = join(HERMES_ZEST_HOME, "pending-finalize");
var QUEUE_DIR = join(HERMES_ZEST_HOME, "queue");
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
var LOG_RETENTION_DAYS = 7;

// ../../packages/plugin-common/src/logger/logger.ts
import { appendFile } from "node:fs/promises";
import { dirname } from "node:path";

// ../../packages/plugin-common/src/utils/fs-utils.ts
import { mkdir, stat } from "node:fs/promises";
async function ensureDirectory(dirPath) {
  try {
    await stat(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true, mode: 448 });
  }
}

// ../../packages/plugin-common/src/logger/logger.ts
var levels = { debug: 0, info: 1, warn: 2, error: 3 };
var pendingWrites = new Set;
async function flushLogs() {
  await Promise.all([...pendingWrites]);
}
var beforeExitRegistered = false;
function registerBeforeExit() {
  if (beforeExitRegistered)
    return;
  beforeExitRegistered = true;
  process.on("beforeExit", () => {
    flushLogs();
  });
}
function formatArgs(args) {
  if (args.length === 0)
    return "";
  return ` ${args.map((a) => a instanceof Error ? a.message : JSON.stringify(a)).join(" ")}`;
}
function writeToFile(rotation, logPrefix, level, message, args) {
  const task = (async () => {
    try {
      const logFilePath = rotation.getDatedLogPath(logPrefix);
      await ensureDirectory(dirname(logFilePath));
      const timestamp = new Date().toISOString();
      await appendFile(logFilePath, `[${timestamp}] ${level}: ${message}${formatArgs(args)}
`);
      rotation.cleanupStaleLogs(logPrefix);
    } catch {}
  })();
  pendingWrites.add(task);
  task.finally(() => pendingWrites.delete(task));
}
function createLogger(config) {
  const { prefix, logRotation, logPrefix = "plugin" } = config;
  let minLevel = "info";
  registerBeforeExit();
  const logger = {
    setLevel(level) {
      minLevel = level;
    },
    debug(message, ...args) {
      if (levels.debug >= levels[minLevel]) {
        writeToFile(logRotation, logPrefix, "DEBUG", message, args);
      }
    },
    info(message, ...args) {
      if (levels.info >= levels[minLevel]) {
        writeToFile(logRotation, logPrefix, "INFO", message, args);
      }
    },
    warn(message, ...args) {
      if (levels.warn >= levels[minLevel]) {
        console.warn(`[${prefix}:Warn] ${message}`, ...args);
        writeToFile(logRotation, logPrefix, "WARN", message, args);
      }
    },
    error(message, error) {
      if (levels.error >= levels[minLevel]) {
        console.error(`[${prefix}:Error] ${message}`, error ?? "");
        writeToFile(logRotation, logPrefix, "ERROR", message, error === undefined ? [] : [error]);
      }
    }
  };
  return { logger, flushLogs };
}
// ../../packages/plugin-common/src/log-rotation/log-rotation.ts
import { readdir, unlink } from "node:fs/promises";
import { join as join2 } from "node:path";
var CLEANUP_THROTTLE_MS = 60 * 60 * 1000;
function getDateString() {
  return new Date().toISOString().split("T")[0];
}
function getDatedLogPath(logsDir, logPrefix) {
  const dateStr = getDateString();
  return join2(logsDir, `${logPrefix}-${dateStr}.log`);
}
function parseDateFromFilename(filename, logPrefix) {
  const pattern = new RegExp(`^${logPrefix}-(\\d{4}-\\d{2}-\\d{2})\\.log$`);
  const match = filename.match(pattern);
  if (!match) {
    return null;
  }
  const date = new Date(match[1] + "T00:00:00Z");
  return Number.isNaN(date.getTime()) ? null : date;
}
function createLogRotation(config) {
  const { logsDir, retentionDays, logger } = config;
  const lastCleanupTime = {};
  async function cleanupStaleLogs(logPrefix) {
    const now = Date.now();
    const lastCleanup = lastCleanupTime[logPrefix] || 0;
    if (now - lastCleanup < CLEANUP_THROTTLE_MS) {
      return;
    }
    lastCleanupTime[logPrefix] = now;
    try {
      await ensureDirectory(logsDir);
      const files = await readdir(logsDir);
      const cutoffDate = new Date(now - retentionDays * 24 * 60 * 60 * 1000);
      for (const file of files) {
        const fileDate = parseDateFromFilename(file, logPrefix);
        if (fileDate && fileDate < cutoffDate) {
          const filePath = join2(logsDir, file);
          try {
            await unlink(filePath);
          } catch (error) {
            logger?.error(`Failed to delete old log file ${file}`, error);
          }
        }
      }
    } catch (error) {
      logger?.error("Failed to cleanup old logs", error);
    }
  }
  async function forceCleanupStaleLogs(logPrefix) {
    lastCleanupTime[logPrefix] = 0;
    await cleanupStaleLogs(logPrefix);
  }
  return { cleanupStaleLogs, forceCleanupStaleLogs };
}

// src/log-rotation/log-rotation.ts
function getDatedLogPath2(logPrefix) {
  return getDatedLogPath(LOGS_DIR, logPrefix);
}
var logRotation = createLogRotation({
  logsDir: LOGS_DIR,
  retentionDays: LOG_RETENTION_DAYS
});
var { cleanupStaleLogs, forceCleanupStaleLogs } = logRotation;

// src/utils/logger.ts
var created = createLogger({
  prefix: "Zest",
  logRotation: { getDatedLogPath: getDatedLogPath2, cleanupStaleLogs }
});
var logger = created.logger;
var flushLogger = created.flushLogs;

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
  await mkdir2(dirname2(IGNORED_SESSIONS_FILE), { recursive: true });
  await writeFile(IGNORED_SESSIONS_FILE, JSON.stringify([...sessions], null, 2), "utf-8");
}
async function isSessionIgnored(sessionId) {
  const sessions = await loadIgnoredSessions();
  return sessions.has(sessionId);
}
async function addIgnoredSession(sessionId) {
  const sessions = await loadIgnoredSessions();
  if (sessions.has(sessionId))
    return false;
  sessions.add(sessionId);
  await saveIgnoredSessions(sessions);
  return true;
}
async function removeIgnoredSession(sessionId) {
  const sessions = await loadIgnoredSessions();
  if (!sessions.has(sessionId))
    return false;
  sessions.delete(sessionId);
  await saveIgnoredSessions(sessions);
  return true;
}
export {
  IGNORED_SESSIONS_FILE,
  addIgnoredSession,
  isSessionIgnored,
  loadIgnoredSessions,
  removeIgnoredSession
};
