// ../../packages/plugin-common/src/analytics/events.ts
var AUTH_DEVICE_CODE_INITIATION_FAILED = "auth_device_code_initiation_failed";
var AUTH_DEVICE_CODE_POLLING_FAILED = "auth_device_code_polling_failed";
var AUTH_AGENT_PROVISIONING_FAILED = "auth_agent_provisioning_failed";
var AUTH_SESSION_LOAD_FAILED = "auth_session_load_failed";
var AUTH_SESSION_CLEAR_FAILED = "auth_session_clear_failed";
var AUTH_SESSION_SAVE_FAILED = "auth_session_save_failed";
var SYNC_NOT_AUTHENTICATED = "sync_not_authenticated";
var SYNC_CHAT_UPLOAD_FAILED = "sync_chat_upload_failed";
var SYNC_NETWORK_ERROR = "sync_network_error";
var SYNC_SERVER_OVERLOAD = "sync_server_overload";
var SYNC_DATA_ERROR = "sync_data_error";
var SYNC_AUTH_ERROR = "sync_auth_error";
var SYNC_BLOCKED_NO_WORKSPACE = "sync_blocked_no_workspace";
var SYNC_STUCK = "sync_stuck";
var AUTH_SESSION_METADATA_LOST = "auth_session_metadata_lost";
var QUEUE_READ_CORRUPTED = "queue_read_corrupted";
var QUEUE_WRITE_FAILED = "queue_write_failed";
var FILE_LOCK_TIMEOUT = "file_lock_timeout";
var FILE_LOCK_CREATE_FAILED = "file_lock_create_failed";
var NOTIFICATION_STATE_WRITE_FAILED = "notification_state_write_failed";
var QUEUE_CAP_EVICTION = "queue_cap_eviction";
var QUEUE_LEGACY_ENTRIES_DROPPED = "queue_legacy_entries_dropped";
var QUEUE_MISMATCHED_ENTRIES_PURGED = "queue_mismatched_entries_purged";
var SYNC_DRAIN_THROTTLED = "sync_drain_throttled";
var SYNC_ORPHANED_MESSAGES_DROPPED = "sync_orphaned_messages_dropped";
var EXTRACTION_PROJECT_DIR_NOT_FOUND = "extraction_project_dir_not_found";
var EXTRACTION_SESSION_FAILED = "extraction_session_failed";
var DAEMON_START_FAILED = "daemon_start_failed";
var DAEMON_RESTART_FAILED = "daemon_restart_failed";
var DAEMON_SYNC_CYCLE_FAILED = "daemon_sync_cycle_failed";
var DAEMON_UNHANDLED_ERROR = "daemon_unhandled_error";
var API_WORKSPACE_FETCH_FAILED = "api_workspace_fetch_failed";
var API_PROFILE_UPDATE_FAILED = "api_profile_update_failed";
var API_PROFILE_METADATA_PREFETCH_FAILED = "api_profile_metadata_prefetch_failed";
var API_STANDUP_TEAM_FETCH_FAILED = "api_standup_team_fetch_failed";
var API_STANDUP_PROMPT_FETCH_FAILED = "api_standup_prompt_fetch_failed";
var API_STANDUP_GENERATION_FAILED = "api_standup_generation_failed";
var API_DATA_CONTROLS_FETCH_FAILED = "api_data_controls_fetch_failed";
var SUPABASE_CLIENT_INIT_FAILED = "supabase_client_init_failed";
var SUPABASE_SESSION_READ_FAILED = "supabase_session_read_failed";
var SUPABASE_SESSION_WRITE_FAILED = "supabase_session_write_failed";
var ERROR_TYPES = [
  AUTH_DEVICE_CODE_INITIATION_FAILED,
  AUTH_DEVICE_CODE_POLLING_FAILED,
  AUTH_AGENT_PROVISIONING_FAILED,
  AUTH_SESSION_CLEAR_FAILED,
  AUTH_SESSION_LOAD_FAILED,
  AUTH_SESSION_SAVE_FAILED,
  AUTH_SESSION_METADATA_LOST,
  SYNC_NOT_AUTHENTICATED,
  SYNC_CHAT_UPLOAD_FAILED,
  SYNC_NETWORK_ERROR,
  SYNC_SERVER_OVERLOAD,
  SYNC_DATA_ERROR,
  SYNC_AUTH_ERROR,
  SYNC_BLOCKED_NO_WORKSPACE,
  SYNC_STUCK,
  QUEUE_READ_CORRUPTED,
  QUEUE_WRITE_FAILED,
  QUEUE_CAP_EVICTION,
  QUEUE_LEGACY_ENTRIES_DROPPED,
  QUEUE_MISMATCHED_ENTRIES_PURGED,
  SYNC_DRAIN_THROTTLED,
  SYNC_ORPHANED_MESSAGES_DROPPED,
  FILE_LOCK_TIMEOUT,
  FILE_LOCK_CREATE_FAILED,
  NOTIFICATION_STATE_WRITE_FAILED,
  EXTRACTION_PROJECT_DIR_NOT_FOUND,
  EXTRACTION_SESSION_FAILED,
  DAEMON_START_FAILED,
  DAEMON_RESTART_FAILED,
  DAEMON_SYNC_CYCLE_FAILED,
  DAEMON_UNHANDLED_ERROR,
  API_WORKSPACE_FETCH_FAILED,
  API_PROFILE_UPDATE_FAILED,
  API_PROFILE_METADATA_PREFETCH_FAILED,
  API_STANDUP_TEAM_FETCH_FAILED,
  API_STANDUP_PROMPT_FETCH_FAILED,
  API_STANDUP_GENERATION_FAILED,
  API_DATA_CONTROLS_FETCH_FAILED,
  SUPABASE_CLIENT_INIT_FAILED,
  SUPABASE_SESSION_READ_FAILED,
  SUPABASE_SESSION_WRITE_FAILED
];
var errorTypeSet = new Set(ERROR_TYPES);

// ../../packages/plugin-common/src/utils/fs-utils.ts
import { mkdir, stat } from "node:fs/promises";
async function ensureDirectory(dirPath) {
  try {
    await stat(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true, mode: 448 });
  }
}

// ../../packages/plugin-common/src/utils/file-lock.ts
var noopFileLock = (_path, fn) => fn();
function resolveFileLock(callback) {
  return callback ?? noopFileLock;
}

// ../../packages/plugin-common/src/auth/session-io.ts
import { mkdir as mkdir2, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
async function readSessionFile(filePath) {
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}
async function writeSessionFile(filePath, session) {
  await mkdir2(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(session, null, 2), {
    encoding: "utf-8",
    mode: 384
  });
}
async function deleteSessionFile(filePath) {
  try {
    await unlink(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }
    throw error;
  }
}
function isSessionStructureValid(session) {
  return Boolean(session.accessToken && session.refreshToken && session.userId && session.email);
}
function isRefreshTokenExpired(session) {
  return Boolean(session.refreshTokenExpiresAt && session.refreshTokenExpiresAt < Date.now());
}

// ../../packages/plugin-common/src/auth/session-manager.ts
function createSessionManager(config) {
  const { sessionFilePath, logger, onError } = config;
  const withFileLock = resolveFileLock(config.withFileLock);
  async function loadSession() {
    try {
      const session = await readSessionFile(sessionFilePath);
      if (!session)
        return null;
      if (!isSessionStructureValid(session)) {
        logger?.warn("Invalid session structure, clearing session");
        await clearSession("invalid_structure");
        return null;
      }
      return session;
    } catch (error) {
      logger?.error("Failed to load session file", error);
      if (error instanceof Error)
        onError?.(error, "load");
      return null;
    }
  }
  async function saveSession(session) {
    try {
      await withFileLock(sessionFilePath, async () => {
        await writeSessionFile(sessionFilePath, session);
      });
      logger?.info("Session saved successfully");
    } catch (error) {
      logger?.error("Failed to save session", error);
      if (error instanceof Error)
        onError?.(error, "save");
      throw error;
    }
  }
  async function clearSession(reason = "unspecified") {
    try {
      await deleteSessionFile(sessionFilePath);
      logger?.info("Session cleared", { reason });
    } catch (error) {
      logger?.error("Failed to clear session", error);
      if (error instanceof Error)
        onError?.(error, "clear");
      throw error;
    }
  }
  async function getValidSession() {
    const session = await loadSession();
    if (!session) {
      logger?.debug("getValidSession: No session found");
      return null;
    }
    if (isRefreshTokenExpired(session)) {
      logger?.warn("getValidSession: Refresh token expired, user must re-authenticate");
      await clearSession("refresh_expired");
      return null;
    }
    return session;
  }
  async function reconcileWorkspaceName(session, workspaces) {
    if (!session.workspaceId)
      return session.workspaceName;
    const current = workspaces.find((ws) => ws.id === session.workspaceId);
    if (!current)
      return session.workspaceName;
    if (current.name !== session.workspaceName) {
      try {
        await updateWorkspaceInSession(current.id, current.name);
      } catch (error) {
        logger?.debug("Failed to update workspace name in session (non-critical)", error);
      }
    }
    return current.name;
  }
  async function updateWorkspaceInSession(workspaceId, workspaceName) {
    try {
      await withFileLock(sessionFilePath, async () => {
        const session = await readSessionFile(sessionFilePath);
        if (!session) {
          logger?.debug("Cannot update workspace: session file does not exist");
          return;
        }
        if (!isSessionStructureValid(session)) {
          throw new Error("Cannot update workspace: session file has invalid structure");
        }
        session.workspaceId = workspaceId;
        session.workspaceName = workspaceName;
        await writeSessionFile(sessionFilePath, session);
      });
      logger?.info("Workspace metadata updated in session");
    } catch (error) {
      logger?.error("Failed to update workspace in session", error);
      if (error instanceof Error)
        onError?.(error, "save");
      throw error;
    }
  }
  async function clearSessionIfStale(staleRefreshToken) {
    const current = await loadSession();
    if (current && current.refreshToken === staleRefreshToken) {
      await clearSession("stale_refresh");
    } else {
      logger?.info("Session refresh token changed on disk, skipping clear");
    }
  }
  return {
    loadSession,
    saveSession,
    clearSession,
    clearSessionIfStale,
    getValidSession,
    reconcileWorkspaceName,
    updateWorkspaceInSession,
    getSessionFilePath: () => sessionFilePath
  };
}

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
import { dirname as dirname2 } from "node:path";
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
      await ensureDirectory(dirname2(logFilePath));
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
import { readdir, unlink as unlink2 } from "node:fs/promises";
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
            await unlink2(filePath);
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

// src/auth/session-manager.ts
var sessionManager = createSessionManager({
  sessionFilePath: SESSION_FILE,
  logger
});
var {
  loadSession,
  saveSession,
  clearSession,
  getValidSession,
  reconcileWorkspaceName,
  updateWorkspaceInSession
} = sessionManager;
export {
  clearSession,
  getValidSession,
  loadSession,
  reconcileWorkspaceName,
  saveSession,
  sessionManager,
  updateWorkspaceInSession
};
